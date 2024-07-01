"use server";

import prisma from "@/util/prisma";
import { Tournament } from "@prisma/client";

export async function setName({id}: Tournament, name: string) {
  await prisma.tournament.update({
    data: {name},
    where: {id},
  });
}