/*
  Warnings:

  - Added the required column `boxCricketLandmark` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boxcricket" ADD COLUMN     "boxCricketLandmark" TEXT NOT NULL;
