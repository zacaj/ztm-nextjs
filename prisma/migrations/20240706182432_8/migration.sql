-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
