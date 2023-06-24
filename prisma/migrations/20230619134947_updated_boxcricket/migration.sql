/*
  Warnings:

  - You are about to drop the column `boxCricketFacilities` on the `Boxcricket` table. All the data in the column will be lost.
  - You are about to drop the column `loginMethod` on the `User` table. All the data in the column will be lost.
  - Added the required column `boxCricketFreeFacilities` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxCricketPaidFacilities` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boxcricket" DROP COLUMN "boxCricketFacilities",
ADD COLUMN     "boxCricketFreeFacilities" TEXT NOT NULL,
ADD COLUMN     "boxCricketPaidFacilities" TEXT NOT NULL;

