/*
  Warnings:

  - Made the column `endDateTime` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "embedCode" TEXT,
ALTER COLUMN "endDateTime" SET NOT NULL,
ALTER COLUMN "isPublished" SET DEFAULT true;

-- CreateIndex
CREATE INDEX "Event_startDateTime_idx" ON "Event"("startDateTime");

-- CreateIndex
CREATE INDEX "Event_eventType_idx" ON "Event"("eventType");

-- CreateIndex
CREATE INDEX "Event_isPublished_idx" ON "Event"("isPublished");
