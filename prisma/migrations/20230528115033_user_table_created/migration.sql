-- CreateEnum
-- CREATE TYPE "Method" AS ENUM ('Email', 'Phone');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "username" TEXT NOT NULL,
    -- "loginMethod" "Method" NOT NULL DEFAULT 'Email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
