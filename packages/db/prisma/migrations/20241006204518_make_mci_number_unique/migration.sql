/*
  Warnings:

  - A unique constraint covering the columns `[mci_number]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "doctors_mci_number_key" ON "doctors"("mci_number");
