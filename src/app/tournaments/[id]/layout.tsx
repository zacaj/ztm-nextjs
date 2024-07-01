import prisma from "@/util/prisma";
// import { TournamentPage } from "./Tournament";
import { notFound } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import { TournamentPage } from "./Tournament";

export default async function({ params: {id}, children, tabs }: PropsWithChildren<{ params: { id: number }; tabs: ReactNode }>) {
  const tour = await prisma.tournament.findUnique({where: {id}});
  if (!tour) return notFound;
  return (
    <>
      <nav>
        <Link href="matches">Matches</Link>
        <Link href="games">Games</Link>
      </nav>
      <TournamentPage tour={tour} />
      <div>{tabs}</div>
    </>
  );
}