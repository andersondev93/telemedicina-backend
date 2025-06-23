/*
  Warnings:

  - You are about to drop the column `especialidade` on the `Medico` table. All the data in the column will be lost.
  - You are about to drop the `_EspecialidadesDoMedico` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `especialidadeId` to the `Medico` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EspecialidadesDoMedico" DROP CONSTRAINT "_EspecialidadesDoMedico_A_fkey";

-- DropForeignKey
ALTER TABLE "_EspecialidadesDoMedico" DROP CONSTRAINT "_EspecialidadesDoMedico_B_fkey";

-- AlterTable
ALTER TABLE "Medico" DROP COLUMN "especialidade",
ADD COLUMN     "especialidadeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_EspecialidadesDoMedico";

-- AddForeignKey
ALTER TABLE "Medico" ADD CONSTRAINT "Medico_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
