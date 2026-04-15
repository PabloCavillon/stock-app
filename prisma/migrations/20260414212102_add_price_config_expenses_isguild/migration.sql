/*
  Warnings:

  - You are about to drop the column `guildDiscount` on the `StoreCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `volumeDiscount` on the `StoreCustomer` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('PURCHASE', 'SHIPPING', 'OTHER');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isGuild" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "StoreCustomer" DROP COLUMN "guildDiscount",
DROP COLUMN "volumeDiscount";

-- CreateTable
CREATE TABLE "PriceConfig" (
    "id" TEXT NOT NULL,
    "dollarRate" DECIMAL(10,2) NOT NULL,
    "shippingPct" DECIMAL(5,2) NOT NULL,
    "profitPct" DECIMAL(5,2) NOT NULL,
    "guildDiscountPct" DECIMAL(5,2) NOT NULL,
    "volumeDiscountPct" DECIMAL(5,2) NOT NULL,
    "volumeThresholdArs" DECIMAL(12,2) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "PriceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "type" "ExpenseType" NOT NULL,
    "description" TEXT NOT NULL,
    "amountUsd" DECIMAL(10,2),
    "amountArs" DECIMAL(12,2),
    "dollarRate" DECIMAL(10,2),
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PriceConfig" ADD CONSTRAINT "PriceConfig_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
