/*
  Warnings:

  - You are about to drop the column `startd` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "startd",
ADD COLUMN     "started" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "ifpa" DROP NOT NULL;
