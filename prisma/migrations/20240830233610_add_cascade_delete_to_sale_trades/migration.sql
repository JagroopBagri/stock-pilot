-- DropForeignKey
ALTER TABLE "SaleTrade" DROP CONSTRAINT "SaleTrade_purchaseTradeId_fkey";

-- AddForeignKey
ALTER TABLE "SaleTrade" ADD CONSTRAINT "SaleTrade_purchaseTradeId_fkey" FOREIGN KEY ("purchaseTradeId") REFERENCES "PurchaseTrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
