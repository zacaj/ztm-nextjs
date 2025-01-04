-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "started" DROP NOT NULL,
ALTER COLUMN "started" DROP DEFAULT;

-- AlterTable
ALTER TABLE "MatchPlayer" ADD COLUMN     "order" INTEGER,
ADD COLUMN     "points" DECIMAL(65,30),
ADD COLUMN     "submittedByPlayerId" BIGINT,
ADD COLUMN     "submittedByUserId" TEXT;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_submittedByPlayerId_fkey" FOREIGN KEY ("submittedByPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
