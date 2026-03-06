/*
  Warnings:

  - You are about to drop the column `sent_from` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `sent_to` on the `message` table. All the data in the column will be lost.
  - Added the required column `reciever` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "message" DROP COLUMN "sent_from",
DROP COLUMN "sent_to",
ADD COLUMN     "reciever" TEXT NOT NULL,
ADD COLUMN     "sender" TEXT NOT NULL;
