/*
  Warnings:

  - You are about to drop the column `stauts` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stauts",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'unverified';
