import prisma from '../src/util/prisma';
import { seq } from '../src/util/misc';
import { Prisma, PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

function genGames() {
  return [
    { name: 'Asteroid Annie' },
    { name: 'Bazaar' },
    { name: 'Cosmos' },
    { name: 'Dungeons and Dragons' },
    { name: 'Elektra' },
    { name: 'Fore' },
    { name: 'Guardians of the Galaxy' },
  ] satisfies Prisma.GameUncheckedCreateWithoutTournamentInput [];
}
function genPlayers() {
  return [
    { name: 'Adam' },
    { name: 'Bob' },
    { name: 'Ciara' },
    { name: 'Derik' },
    { name: 'Eric' },
    { name: 'Francis' },
    { name: 'Greg' },
  ] satisfies Prisma.PlayerUncheckedCreateWithoutTournamentInput [];
}

async function main() {
  const t = await prisma.tournament.create({
    data: {
      name: '',
      maxPlayers: 2,
      type: 'MATCHPLAY',
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
      finishOrder: seq(nPlayer, 1).shuffle(),
      players: { connect: t.players.slice().shuffle().slice(0, nPlayer) },
    }});
  for (let i=0; i<3; i++)
    await prisma.match.create({ data: {
      tournamentId: t.id,
      gameId: t.games.random().id,
      players: { connect: t.players.slice().shuffle().slice(0, nPlayer) },
    }});
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });