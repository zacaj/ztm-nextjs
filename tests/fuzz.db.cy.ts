import { LiveTestDb } from "./liveTestDb"
import { seedDb } from '../prisma/seed';
import { getStandings } from "../src/apis/tournament.api";

let liveDb: LiveTestDb;
beforeEach(async () => {
  liveDb = await LiveTestDb.getInstance(seedDb);
})
after(async () => {
  LiveTestDb.releaseInstance(seedDb);
})

test('stuff', async () => {
  const results = await getStandings(BigInt(1));
  expect(results).eq( []);
})