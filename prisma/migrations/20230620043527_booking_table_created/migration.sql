-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "slots" JSONB NOT NULL,
    "boxCricketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_boxCricketId_fkey" FOREIGN KEY ("boxCricketId") REFERENCES "Boxcricket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
