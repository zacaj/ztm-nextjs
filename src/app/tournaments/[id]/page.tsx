import prisma from "@/util/prisma";
// import { TournamentPage } from "./Tournament";
import { TourBase } from "@/util/types";
import { notFound } from "next/navigation";

// const TournamentPage = dynamic(() => import(`../../../components/Tournament`).then(i => i.TournamentPage), { ssr: false });
import { TournamentPage } from "../../../components/Tournament";

export default async function({ params: { id }}: { params: { id: number }}) {
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