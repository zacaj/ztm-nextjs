"use server";

import { seq } from "@/util/misc";
import prisma from "@/util/prisma";
import { UserError } from "@/util/types";
import { Game, Prisma, Tournament } from "@prisma/client";

export async function setName({ id }: Tournament, name: string) {
  await prisma.tournament.update({
    data: { name },
    where: { id },
  });
}

export async function editGame({ id, ...data }: Partial<Game>&Pick<Game, 'id'>) {
  await new Promise(r => setTimeout(r, 200));
  throw new Error('x');
  // await prisma.game.update({
  //   where: { id },
  //   data,
  // });
}

export async function addGame({ ...data }: Prisma.GameUncheckedCreateInput) {
  await prisma.game.create({
    data,
  });
}

export async function getMatches(tournamentId: bigint, where?: Prisma.MatchWhereInput) {
  const roundNum = await getCurRound(tournamentId);

  return await prisma.match.findMany({
    where: {
      OR: [
        { roundNum },
        { completed: null },
      ],
      ...where,
      tournamentId,
    },
    include: {
      game: true,
      players: true,
    },
  });
}

export async function nextRound(tournamentId: bigint) {
  const tour = await prisma.tournament.findUniqueOrThrow({
    where: {
      id: tournamentId,
    },
    include: {
      players: true,
      games: { where: {
        deleted: false,
        enabled: true,
      }},
      matches: {
        where: {
          completed: null,
        },
      },
    },
  });

  if (tour.type !== 'MATCHPLAY')
    throw new UserError('tournament does not have rounds');

  if (tour.matches.length)
    throw new UserError('Match(es) not complete');

  const lastRoundNum = await getCurRound(tournamentId);

  const playersLeft = tour.players.slice().shuffle();
  const gamesLeft = tour.games.slice().shuffle();
  const numMatches = Math.ceil(playersLeft.length / tour.maxPlayers);
  if (numMatches > gamesLeft.length)
    throw new UserError('not enough games');

  for (const i of seq(numMatches)) {
    await prisma.match.create({
      data: {
        tournamentId,
        gameId: gamesLeft.shift()!.id,
        roundNum: lastRoundNum!+1,
        players: {
          connect: playersLeft.slit(i*tour.maxPlayers, tour.maxPlayers).map(p => ({ id: p.id })),
        },
      },
    });
  }
}

// export async function devFinishAll(tournamentId: bigint) {
//   await prisma.match.updateMany({
//     where: {
//       tournamentId,
//       completed: null,
//     },
//     data: {
//       completed: new Date(),
//       finishOrder: {
//         set: [1, 2, 3, 4],
//       },
//     },
//   });
// }

// export const devMatchUpdate: (typeof prisma)['match']['updateMany'] = (args) => {
//   return prisma.match.updateMany(args);
// };

type P = typeof prisma;
type TableUpdates = {[K in keyof P as P[K] extends { updateMany: any }? K : never]: P[K] };
type TableUpdateKeys = keyof TableUpdates;
type DevUpdate<K extends TableUpdateKeys> = P[K]['updateMany'];
export const devUpdate = <K extends TableUpdateKeys>(
  key: K,
  ...args: Parameters<DevUpdate<K>>
): ReturnType<DevUpdate<K>> =>
  (prisma[key] as any).updateMany(...args);

type TableMethods<M extends PropertyKey> = {[K in keyof P as P[K] extends { M: any }? K : never]: P[K] };
type TableUpdates2 = TableMethods<'updateMany'>;

async function getCurRound(tournamentId: bigint) {
  const { _max: { roundNum }} = await prisma.match.aggregate({
    where: { tournamentId },
    _max: { roundNum: true },
  });
  return roundNum;
}
