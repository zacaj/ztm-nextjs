/*
  Warnings:

  - Made the column `tournamentId` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_tournamentId_fkey";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "gameNum" INTEGER,
ADD COLUMN     "roundNum" INTEGER,
ALTER COLUMN "tournamentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "gamesPerRound" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
