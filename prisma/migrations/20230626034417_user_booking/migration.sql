-- CreateTable
CREATE TABLE "Userbooking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "boxCricketId" TEXT NOT NULL,
    "userBookings" JSONB NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Userbooking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Userbooking" ADD CONSTRAINT "Userbooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Userbooking" ADD CONSTRAINT "Userbooking_boxCricketId_fkey" FOREIGN KEY ("boxCricketId") REFERENCES "Boxcricket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
