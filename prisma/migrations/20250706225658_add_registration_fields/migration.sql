-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "numberOfGuests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "specialRequirements" TEXT;
