import prisma from "@/util/prisma";
// import { TournamentPage } from "./Tournament";
import { notFound } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";
import Link from "next/link";

export default async function({ params: {id}, children, tabs }: PropsWithChildren<{ params: { id: number }; tabs: ReactNode }>) {

  return (
    <>
      <nav>
        <Link href="/test/matches">Matches</Link>
        <Link href="/test/games">Games</Link>
      </nav>
      <div>{tabs}</div>
    </>
  );
}