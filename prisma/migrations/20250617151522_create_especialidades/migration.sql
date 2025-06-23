-- CreateTable
CREATE TABLE "Especialidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EspecialidadesDoMedico" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EspecialidadesDoMedico_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "Especialidade"("nome");

-- CreateIndex
CREATE INDEX "_EspecialidadesDoMedico_B_index" ON "_EspecialidadesDoMedico"("B");

-- AddForeignKey
ALTER TABLE "_EspecialidadesDoMedico" ADD CONSTRAINT "_EspecialidadesDoMedico_A_fkey" FOREIGN KEY ("A") REFERENCES "Especialidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EspecialidadesDoMedico" ADD CONSTRAINT "_EspecialidadesDoMedico_B_fkey" FOREIGN KEY ("B") REFERENCES "Medico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
