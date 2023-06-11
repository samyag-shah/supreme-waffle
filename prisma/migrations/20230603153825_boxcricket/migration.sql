/*
  Warnings:

  - You are about to drop the column `bookingSlots` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `boxCricketAddress` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `boxCricketName` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `boxImages` on the `Owner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "bookingSlots",
DROP COLUMN "boxCricketAddress",
DROP COLUMN "boxCricketName",
DROP COLUMN "boxImages";

-- CreateTable
CREATE TABLE "Boxcricket" (
    "id" TEXT NOT NULL,
    "boxCricketAddress" TEXT NOT NULL,
    "boxCricketName" TEXT NOT NULL,
    "bookingSlots" JSONB NOT NULL,
    "boxImages" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Boxcricket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Boxcricket" ADD CONSTRAINT "Boxcricket_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
