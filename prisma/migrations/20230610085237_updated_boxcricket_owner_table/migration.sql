/*
  Warnings:

  - You are about to drop the column `boxImages` on the `Boxcricket` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `ownername` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Owner` table. All the data in the column will be lost.
  - Added the required column `boxCricketArea` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxCricketCity` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxCricketImages` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxCricketState` to the `Boxcricket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oweneName` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerPhone` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boxcricket" DROP COLUMN "boxImages",
ADD COLUMN     "boxCricketArea" TEXT NOT NULL,
ADD COLUMN     "boxCricketCity" TEXT NOT NULL,
ADD COLUMN     "boxCricketImages" JSONB NOT NULL,
ADD COLUMN     "boxCricketState" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "email",
DROP COLUMN "ownername",
DROP COLUMN "phone",
ADD COLUMN     "oweneName" TEXT NOT NULL,
ADD COLUMN     "ownerEmail" TEXT,
ADD COLUMN     "ownerPhone" TEXT NOT NULL;
