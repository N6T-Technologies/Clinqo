/*
  Warnings:

  - A unique constraint covering the columns `[gstin]` on the table `clinics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clinics_gstin_key" ON "clinics"("gstin");

-- CreateIndex
CREATE INDEX "clinics_gstin_idx" ON "clinics"("gstin");
