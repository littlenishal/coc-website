/*
  Warnings:

  - You are about to drop the column `maxAttendees` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "maxAttendees",
ADD COLUMN     "registrationUrl" TEXT;
