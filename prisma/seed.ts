import prisma from '../src/util/prisma';
import { seq } from '../src/util/misc';
import { Prisma, PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

function genGames() {
  return [
    { name: `Asteroid Annie` },
    { name: `Bazaar` },
    { name: `Cosmos` },
    { name: `Dungeons and Dragons` },
    { name: `Elektra` },
    { name: `Fore` },
    { name: `Guardians of the Galaxy` },
  ] satisfies Prisma.GameUncheckedCreateWithoutTournamentInput [];
}
function genPlayers() {
  return [
    { name: `Adam Ascance` },
    { name: `Bob Barlow` },
    { name: `Ciara Centra` },
    { name: `Derik Dacken` },
    { name: `Eric Russel` },
    { name: `Francis Fredrickson` },
    { name: `Greg Gunlow` },
  ] satisfies Prisma.PlayerUncheckedCreateWithoutTournamentInput [];
}

async function main() {
  await prisma.user.create({
    data: {
      id: `zacaj`,
      sessions: {
        create: {
          id: `zacaj`,
          expiresAt: null,
        },
      },
    },
  });

  {
    const t = await prisma.tournament.create({
      data: {
        name: `Monthly Gig`,
        maxPlayers: 2,
        type: `FRENZY`,
        creatorId: `zacaj`,
        games: { createMany: { data: genGames() }},
        players: { createMany: { data: genPlayers() }},
      },
      include: {
        games: true,
        players: true,
      },
    });
    const nPlayer = 2;
    for (let i=0; i<5; i++)
      await prisma.match.create({ data: {
        tournamentId: t.id,
        gameId: t.games.random().id,
        completed: new Date(),
        players: { createMany: { data: t.players.slice().shuffle().slice(0, nPlayer).zip(seq(nPlayer, 1).shuffle()).map(([p, order], i) => ({ playerId: p.id, place: order, order: i+1 })) }},
      }});
    for (let i=0; i<3; i++)
      await prisma.match.create({ data: {
        tournamentId: t.id,
        gameId: t.games.random().id,
        players: { createMany: { data: t.players.slice().shuffle().slice(0, nPlayer).map((p, i) => ({ playerId: p.id, place: null, order: i+1 })) }},
      }});
  }
  {
    const t = await prisma.tournament.create({
      data: {
        name: `Weekly MP`,
        maxPlayers: 3,
        type: `MATCHPLAY`,
        creatorId: `zacaj`,
        games: { createMany: { data: genGames() }},
        players: { createMany: { data: genPlayers() }},
      },
      include: {
        games: true,
        players: true,
      },
    });
    const nPlayer = t.maxPlayers;
    let roundNum = 1;
    for (;roundNum<3; roundNum++)
      for (let i=0; i<t.players.length / nPlayer; i++)
        await prisma.match.create({ data: {
          tournamentId: t.id,
          gameId: t.games.random().id,
          completed: new Date(),
          roundNum,
          players: { createMany: { data: t.players.slice().shuffle().slice(0, nPlayer).zip(seq(nPlayer, 1).shuffle()).map(([p, order], i) => ({ playerId: p.id, place: order, order: i+1 })) }},
        }});
    for (let i=0; i<3; i++)
      await prisma.match.create({ data: {
        tournamentId: t.id,
        gameId: t.games.random().id,
        roundNum,
        players: { createMany: { data: t.players.slice().shuffle().slice(0, nPlayer).map((p, i) => ({ playerId: p.id, place: null, order: i+1 })) }},
      }});
  }
}

if (require.main === module)
  void main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

export const seedDb = main;