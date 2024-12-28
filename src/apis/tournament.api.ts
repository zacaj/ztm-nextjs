"use server";

import prisma from "@/util/prisma";
import { UserError } from "@/util/types";
import { Game, Prisma, Tournament, type Player } from "@prisma/client";
import { genGroupSizes } from "./logic";

export async function setName({ id }: Tournament, name: string) {
  await prisma.tournament.update({
    data: { name },
    where: { id },
  });
}

export async function editGame({ id, ...data }: Partial<Game>&Pick<Game, `id`>) {
  await prisma.game.update({
    where: { id },
    data,
  });
}

export async function addGame({ ...data }: Prisma.GameUncheckedCreateInput) {
  await prisma.game.create({
    data,
  });
}
export async function editPlayer({ id, ...data }: Partial<Player>&Pick<Player, `id`>) {
  await prisma.player.update({
    where: { id },
    data,
  });
}

export async function addPlayer({ ...data }: Prisma.PlayerUncheckedCreateInput) {
  await prisma.player.create({
    data,
  });
}

export async function getMatches(tournamentId: bigint, where?: Prisma.MatchWhereInput) {
  const roundNum = await getCurRound(tournamentId);

  return {
    matches: await prisma.match.findMany({
      where: {
        ...(where ?? {
          OR: [
            { roundNum },
            { completed: null },
          ]}),
        tournamentId,
      },
      include: {
        game: true,
        players: {
          include: {
            player: true,
          },
          orderBy: { id: `asc` },
        },
      },
    }),
    curRound: roundNum,
  };
}

export async function saveMatchResults(matchId: bigint, results: { playerId: bigint; place: number | null }[]) {
  const match = await prisma.match.findUniqueOrThrow({
    where: { id: matchId },
    include: {
      players: true,
    },
  });
  // if (finishOrder.length < match.players.length)
  //   throw new UserError(`not enough results for player count`);
  if (results.some(r => r.place!==null && (r.place<1 || r.place > match.players.length)))
    throw new UserError(`places must be [1-N]`);
  if (match.completed)
    throw new UserError(`match is already completed`);

  return await prisma.match.update({
    where: { id: matchId },
    data: {
      players: {
        updateMany: results.map(r => ({
          where: {
            playerId: r.playerId,
            matchId: matchId,
          },
          data: {
            place: r.place,
          },
        })),
      },
      completed: results.length === match.players.length && results.every(p => p.place)? new Date() : undefined,
    },
  });
}

export async function nextRound(tournamentId: bigint) {
  return prisma.$transaction(async () => {
    const tour = await prisma.tournament.findUniqueOrThrow({
      where: {
        id: tournamentId,
      },
      include: {
        players: { where: {
          enabled: true,
          deleted: false,
        }},
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

    if (tour.type !== `MATCHPLAY`)
      throw new UserError(`tournament does not have rounds`);

    if (tour.matches.length)
      throw new UserError(`Match(es) not complete`);

    const lastRoundNum = await getCurRound(tournamentId);

    const playersLeft = tour.players.slice().shuffle();
    const gamesLeft = tour.games.slice().shuffle();
    const groups = genGroupSizes(playersLeft.length, tour.maxPlayers);
    if (groups.length > gamesLeft.length)
      throw new UserError(`not enough games`);

    for (const groupSize of groups) {
      await prisma.match.create({
        data: {
          tournamentId,
          gameId: gamesLeft.shift()!.id,
          roundNum: lastRoundNum!+1,
          players: {
            connect: playersLeft.splice(0, groupSize).map(p => ({ id: p.id })),
          },
        },
      });
    }
  });
}


type P = typeof prisma;
type TableUpdates = {[K in keyof P as P[K] extends { updateMany: any }? K : never]: P[K] };
type TableUpdateKeys = keyof TableUpdates;
type DevUpdate<K extends TableUpdateKeys> = P[K][`updateMany`];
export const devUpdate = async <K extends TableUpdateKeys>(
  key: K,
  ...args: Parameters<DevUpdate<K>>
): Promise<Awaited<ReturnType<DevUpdate<K>>>> =>
  (prisma[key] as any).updateMany(...args);

type TableMethods<M extends PropertyKey> = {[K in keyof P as P[K] extends { M: any }? K : never]: P[K] };
type TableUpdates2 = TableMethods<`updateMany`>;

export async function getCurRound(tournamentId: bigint|number) {
  const { _max: { roundNum }} = await prisma.match.aggregate({
    where: { tournamentId },
    _max: { roundNum: true },
  });
  return roundNum;
}
