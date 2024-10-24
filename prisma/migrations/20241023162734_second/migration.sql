-- DropForeignKey
ALTER TABLE "Professor" DROP CONSTRAINT "Professor_departmentId_fkey";

-- AlterTable
ALTER TABLE "Professor" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
