/*
  Warnings:

  - You are about to drop the `Rates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Rates";

-- CreateTable
CREATE TABLE "Rate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rate_name_key" ON "Rate"("name");
