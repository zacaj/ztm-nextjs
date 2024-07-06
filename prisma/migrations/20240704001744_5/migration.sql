/*
  Warnings:

  - Added the required column `maxPlayers` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TournamentType" AS ENUM ('FRENZY', 'MATCHPLAY');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "tournamentId" BIGINT;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "maxPlayers" INTEGER NOT NULL,
ADD COLUMN     "type" "TournamentType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;
