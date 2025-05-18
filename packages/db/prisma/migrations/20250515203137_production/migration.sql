-- AlterTable
ALTER TABLE "_ClinicToDoctor" ADD CONSTRAINT "_ClinicToDoctor_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ClinicToDoctor_AB_unique";
