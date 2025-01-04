import { PrismaClient } from '@prisma/client';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { Client } from 'pg';

export type SeedFn = (prisma: PrismaClient) => Promise<void>;

// spins up a postgres instance, runs migrations + seeds data, ready for testing
export class LiveTestDb {
  protected static instances = new Map<SeedFn | null, LiveTestDb>();
  // get a clean instance seeded with the provided data
  static async getInstance(seedFn: SeedFn | null) {
    let instance = LiveTestDb.instances.get(seedFn);
    if (!instance || instance.isDirty) {
      await instance?.shutdown();
      instance = new LiveTestDb(seedFn);
    }
    await instance.setup();
    LiveTestDb.instances.set(seedFn, instance);
    return instance;
  }
  // if you're using a seed function and you're done with your tests, call this to clean up
  static async releaseInstance(seedFn: SeedFn) {
    const instance = LiveTestDb.instances.get(seedFn);
    if (!instance) return;
    await instance.shutdown();
    LiveTestDb.instances.delete(seedFn);
  }
  static async releaseAll() {
    await Promise.all([...LiveTestDb.instances.values()].map((i) => i.shutdown()));
  }

  client?: Client;
  container?: StartedPostgreSqlContainer;
  isSetup = false;
  dbModifications = 0;
  get isDirty() {
    return this.dbModifications > 0;
  }
  protected _prisma?: PrismaClient;

  protected constructor(public seedFn: SeedFn | null) {}

  async setup() {
    if (this.isSetup) return false;
    const setupStart = new Date();
    this.container = await new PostgreSqlContainer(`postgres`).start();
    this.client = new Client({
      host: this.container.getHost(),
      port: this.container.getPort(),
      database: this.container.getDatabase(),
      user: this.container.getUsername(),
      password: this.container.getPassword(),
    });

    await this.client.connect();
    try {
      // await this.client.query(`
      // `);
      const migrateStart = new Date();
      const migrationResult = execSync(
        `export DATABASE_URL=${this.testDbUrl} && npx prisma migrate deploy | grep -v "Applying migration" | grep -v "+- " | grep -v "The following migrations"`,
        {
          stdio: `inherit`,
          encoding: `utf-8`,
        },
      );
      if (migrationResult) console.log(`Prisma output: ` + migrationResult);

      console.info(
        `Setup live test db in ${(new Date().getTime() - setupStart.getTime()) / 1000}s.  (Create DB took  ${
          (migrateStart.getTime() - setupStart.getTime()) / 1000
        }s, migrate took  ${(new Date().getTime() - migrateStart.getTime()) / 1000}s)`,
      );

      if (this.seedFn) {
        await this.seedFn(this.prisma);
        this.dbModifications = 0;
      }

      this.isSetup = true;
      return true;
    } catch (err: unknown) {
      console.error(`Error setting up live db testing db:`, err);
      await this.shutdown();
      throw err;
    }
  }

  async shutdown() {
    if (this.client) {
      const start = new Date();
      await this.client.end();
      this.client = undefined;
      await this.container?.stop();
      this.container = undefined;
      console.info(`dropped db in  ${(new Date().getTime() - start.getTime()) / 1000}s`);
    }
    await this._prisma?.$disconnect();
    this._prisma = undefined;
    LiveTestDb.instances.delete(this.seedFn);
  }

  get testDbUrl() {
    return this.container?.getConnectionUri();
  }

  get prisma() {
    if (!this._prisma) {
      this._prisma = new PrismaClient({
        datasources: { db: { url: this.testDbUrl }},
      });

      const prisma = this._prisma as any;
      // spy on modification of db
      for (const func of [`create`, `createMany`, `delete`, `deleteMany`, `update`, `updateMany`, `upsert`]) {
        for (const table of Object.values(this._prisma)) {
          if (table && typeof table === `object` && func in table) {
            const originalFunction = table[func];
            table[func] = (...args: any[]) => {
              this.dbModifications++;
              return Reflect.apply(originalFunction, table, args);
            };
          }
        }
      }
      for (const func of [`$executeRaw`, `$executeRawUnsafe`, `$queryRaw`, `$queryRawUnsafe`]) {
        const originalFunction: any = prisma[func];
        prisma[func] = (...args: any[]) => {
          if (typeof args[0] !== `string` || !args[0].startsWith(`SET LOCAL`)) this.dbModifications++;
          return Reflect.apply(originalFunction, this._prisma, args);
        };
      }
      const originalTransaction = this._prisma.$transaction;
      prisma.$transaction = (...args: any[]) => {
        const oldDbMoficationCount = this.dbModifications;

        return Reflect.apply(originalTransaction, this._prisma, args).catch((e: unknown) => {
          this.dbModifications = oldDbMoficationCount;
          throw e;
        });
      };
    }
    return this._prisma;
  }
}
