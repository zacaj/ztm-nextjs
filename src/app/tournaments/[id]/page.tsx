import prisma from "@/util/prisma";
// import { TournamentPage } from "./Tournament";
import { notFound } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import { TournamentPage } from "../../../components/Tournament";

export default async function({ params: { id }}: { params: { id: number } }) {
  const tour = await prisma.tournament.findUnique({
    where: { id },
    include: {
      games: true,
      players: true,
    },
  });
  if (!tour) return notFound();
  return (
    <>
      <TournamentPage tour={tour}/>
    </>
  );
}