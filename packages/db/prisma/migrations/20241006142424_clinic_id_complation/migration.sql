/*
  Warnings:

  - Made the column `clinic_id` on table `clinic_heads` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "clinic_heads" DROP CONSTRAINT "clinic_heads_clinic_id_fkey";

-- AlterTable
ALTER TABLE "clinic_heads" ALTER COLUMN "clinic_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "clinic_heads" ADD CONSTRAINT "clinic_heads_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
