/*
  Warnings:

  - You are about to drop the column `address` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `EventComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventRegistration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventComment" DROP CONSTRAINT "EventComment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventComment" DROP CONSTRAINT "EventComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventRegistration" DROP CONSTRAINT "EventRegistration_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventRegistration" DROP CONSTRAINT "EventRegistration_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "address";

-- DropTable
DROP TABLE "EventComment";

-- DropTable
DROP TABLE "EventRegistration";

-- DropEnum
DROP TYPE "RegistrationStatus";
