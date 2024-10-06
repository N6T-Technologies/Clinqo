-- DropForeignKey
ALTER TABLE "clinic_heads" DROP CONSTRAINT "clinic_heads_clinic_id_fkey";

-- AlterTable
ALTER TABLE "clinic_heads" ALTER COLUMN "clinic_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "clinic_heads" ADD CONSTRAINT "clinic_heads_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
