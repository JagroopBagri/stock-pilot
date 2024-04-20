/*
  Warnings:

  - You are about to drop the column `forgotPasswordTokenExpiration` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verifyToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verifyTokenExpiration` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "forgotPasswordTokenExpiration",
DROP COLUMN "verifyToken",
DROP COLUMN "verifyTokenExpiration";
