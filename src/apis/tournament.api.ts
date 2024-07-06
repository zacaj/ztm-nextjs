"use server";

import prisma from "@/util/prisma";
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

export async function getMatches(tournamentId: bigint) {
  return await prisma.match.findMany({
    where: {
      tournamentId,
    },
    include: {
      game: true,
      players: true,
    },
  });
}

export async function devFinishAll(tournamentId: bigint) {
  await prisma.match.updateMany({
    where: {
      tournamentId,
      completed: null,
    },
    data: {
      completed: new Date(),
      finishOrder: {
        set: [1, 2, 3, 4],
      },
    },
  });
}