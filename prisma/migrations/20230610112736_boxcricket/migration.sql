/*
  Warnings:

  - Added the required column `boxCricketFacilities` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxSlotPrice` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minSlotPrice` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boxcricket" ADD COLUMN     "boxCricketFacilities" TEXT NOT NULL,
ADD COLUMN     "maxSlotPrice" INTEGER NOT NULL,
ADD COLUMN     "minSlotPrice" INTEGER NOT NULL;
