-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "ownername" TEXT NOT NULL,
    "boxCricketAddress" TEXT NOT NULL,
    "boxCricketName" TEXT NOT NULL,
    "bookingSlots" JSONB NOT NULL,
    "boxImages" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);
