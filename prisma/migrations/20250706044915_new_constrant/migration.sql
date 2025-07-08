/*
  Warnings:

  - A unique constraint covering the columns `[id,type]` on the table `category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "category_name_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "category_id_type_key" ON "category"("id", "type");
