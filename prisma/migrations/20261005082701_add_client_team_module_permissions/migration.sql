/*
  Warnings:

  - A unique constraint covering the columns `[clientId,name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "clientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "createdById" TEXT;

-- CreateTable
CREATE TABLE "ClientModule" (
    "clientId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "ClientModule_pkey" PRIMARY KEY ("clientId","moduleId")
);

-- CreateTable
CREATE TABLE "TeamMemberModule" (
    "teamMemberId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "TeamMemberModule_pkey" PRIMARY KEY ("teamMemberId","moduleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_clientId_name_key" ON "Role"("clientId", "name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientModule" ADD CONSTRAINT "ClientModule_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientModule" ADD CONSTRAINT "ClientModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMemberModule" ADD CONSTRAINT "TeamMemberModule_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMemberModule" ADD CONSTRAINT "TeamMemberModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
