/*
  Warnings:

  - You are about to drop the `stockTrades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stocks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "stockTrades" DROP CONSTRAINT "stockTrades_userId_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_purchaseTradeId_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_saleTradeId_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_userId_fkey";

-- DropTable
DROP TABLE "stockTrades";

-- DropTable
DROP TABLE "stocks";

-- CreateTable
CREATE TABLE "stockTrade" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ticker" VARCHAR(20) NOT NULL,
    "type" "TradeType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "dateOfTrade" TIMESTAMP(3) NOT NULL,
    "notes" VARCHAR(255),
    "stockId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stockTrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ticker" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMPTZ(6) NOT NULL,
    "currentPrice" DECIMAL(10,2),

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stockTrade" ADD CONSTRAINT "stockTrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockTrade" ADD CONSTRAINT "stockTrade_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
