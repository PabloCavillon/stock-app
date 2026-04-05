ALTER TABLE "Order" ADD COLUMN "code" TEXT;
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");