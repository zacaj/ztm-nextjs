import prisma from "@/util/prisma";
// import { TournamentPage } from "./Tournament";
import { TourBase } from "@/util/types";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { TournamentPage } from "../../../components/Tournament";

export default async function(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;

  const {
    id,
  } = params;

  const tour = await prisma.tournament.findUnique({
    where: { id },
    include: {
      games: {
        where: {
          deleted: false,
        },
        orderBy: [{ enabled: `desc` }],
        include: {
          _count: {
            select: {
              matches: true,
            },
          },
        },
      },
      players: {
        where: {
          deleted: false,
        },
        include: {
          _count: {
            select: {
              matches: true,
            },
          },
        },
      },
    },
  });
  if (!tour) return notFound();
  return (
    <>
      <TournamentPage tour={{ ...tour } satisfies TourBase}/>
    </>
  );
}