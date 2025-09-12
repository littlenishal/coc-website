/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InstagramFeed` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InstagramIntegration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `feedId` column on the `InstagramIntegration` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `createdById` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `InstagramFeed` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `InstagramIntegration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."InstagramIntegration" DROP CONSTRAINT "InstagramIntegration_feedId_fkey";

-- AlterTable
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "createdById",
ADD COLUMN     "createdById" UUID NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."InstagramFeed" DROP CONSTRAINT "InstagramFeed_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "InstagramFeed_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."InstagramIntegration" DROP CONSTRAINT "InstagramIntegration_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "feedId",
ADD COLUMN     "feedId" UUID,
ADD CONSTRAINT "InstagramIntegration_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Event_createdById_idx" ON "public"."Event"("createdById");

-- CreateIndex
CREATE INDEX "InstagramIntegration_feedId_idx" ON "public"."InstagramIntegration"("feedId");

-- AddForeignKey
ALTER TABLE "public"."InstagramIntegration" ADD CONSTRAINT "InstagramIntegration_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "public"."InstagramFeed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
