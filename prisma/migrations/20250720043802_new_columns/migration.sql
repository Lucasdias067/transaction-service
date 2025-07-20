/*
  Warnings:

  - The values [PENDING,PAID,RECEIVED] on the enum `TransactionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [INCOME,EXPENSE] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[name,user_id,type]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionStatus_new" AS ENUM ('pending', 'paid', 'received', 'overdue', 'canceled');
ALTER TABLE "transaction" ALTER COLUMN "status" TYPE "TransactionStatus_new" USING ("status"::text::"TransactionStatus_new");
ALTER TYPE "TransactionStatus" RENAME TO "TransactionStatus_old";
ALTER TYPE "TransactionStatus_new" RENAME TO "TransactionStatus";
DROP TYPE "TransactionStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('income', 'expense');
ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TABLE "category" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "TransactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_userId_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_userId_fkey";

-- DropIndex
DROP INDEX "category_id_type_key";

-- DropIndex
DROP INDEX "category_name_key";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "categoryId",
DROP COLUMN "userId",
ADD COLUMN     "category_id" TEXT NOT NULL,
ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "category_user_id_type_idx" ON "category"("user_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_user_id_type_key" ON "category"("name", "user_id", "type");

-- CreateIndex
CREATE INDEX "transaction_user_id_type_idx" ON "transaction"("user_id", "type");

-- CreateIndex
CREATE INDEX "transaction_category_id_idx" ON "transaction"("category_id");

-- CreateIndex
CREATE INDEX "transaction_status_idx" ON "transaction"("status");

-- CreateIndex
CREATE INDEX "transaction_due_date_idx" ON "transaction"("due_date");

-- CreateIndex
CREATE INDEX "transaction_created_at_idx" ON "transaction"("created_at");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
