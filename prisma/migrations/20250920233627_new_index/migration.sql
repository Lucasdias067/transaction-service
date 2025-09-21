/*
  Warnings:

  - You are about to drop the column `paid_at` on the `transaction` table. All the data in the column will be lost.
  - Made the column `due_date` on table `transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."transaction" DROP COLUMN "paid_at",
ALTER COLUMN "due_date" SET NOT NULL,
ALTER COLUMN "effective_date" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "transaction_user_id_due_date_idx" ON "public"."transaction"("user_id", "due_date");
