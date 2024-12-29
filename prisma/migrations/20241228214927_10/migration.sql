/*
  Warnings:

  - You are about to drop the column `finishOrder` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the `_MatchToPlayer` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "TournamentType" ADD VALUE 'BEST_GAME';

-- DropForeignKey
ALTER TABLE "_MatchToPlayer" DROP CONSTRAINT "_MatchToPlayer_A_fkey";

-- DropForeignKey
ALTER TABLE "_MatchToPlayer" DROP CONSTRAINT "_MatchToPlayer_B_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "finishOrder";

-- DropTable
DROP TABLE "_MatchToPlayer";

-- CreateTable
CREATE TABLE "MatchPlayer" (
    "id" BIGSERIAL NOT NULL,
    "matchId" BIGINT NOT NULL,
    "playerId" BIGINT NOT NULL,
    "place" INTEGER,
    "score" BIGINT,

    CONSTRAINT "MatchPlayer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
