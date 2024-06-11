/*
  Warnings:

  - You are about to drop the column `userId` on the `TestResult` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestResult" DROP CONSTRAINT "TestResult_userId_fkey";

-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "userId";
