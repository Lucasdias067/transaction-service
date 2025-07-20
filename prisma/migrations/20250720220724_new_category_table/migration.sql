/*
  Warnings:

  - Added the required column `effective_date` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "effective_date" TIMESTAMP(3) NOT NULL;
