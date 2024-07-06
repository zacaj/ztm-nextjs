import prisma from "@/util/prisma";
// import { TournamentPage } from "./Tournament";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import Link from "next/link";

export default async function({ params: { id }, children }: PropsWithChildren<{ params: { id: number } }>) {

  return (
    <>
      <nav>
        <Link href="matches">Matches</Link>
        <Link href="games">Games</Link>
      </nav>
      <div>{children}</div>
    </>
  );
}