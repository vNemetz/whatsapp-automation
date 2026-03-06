/*
  Warnings:

  - You are about to drop the column `phone` on the `message` table. All the data in the column will be lost.
  - Added the required column `sent_from` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sent_to` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "message" DROP COLUMN "phone",
ADD COLUMN     "sent_from" TEXT NOT NULL,
ADD COLUMN     "sent_to" TEXT NOT NULL;
