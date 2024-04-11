/*
  Warnings:

  - You are about to drop the column `email` on the `authToken` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `authToken` table. All the data in the column will be lost.
  - Added the required column `expirationDate` to the `authToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `authToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authToken" DROP COLUMN "email",
DROP COLUMN "user",
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "authToken" ADD CONSTRAINT "authToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
