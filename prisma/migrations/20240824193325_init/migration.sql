-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "forgotPasswordToken" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,
    "type" "TradeType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "ticker" VARCHAR(20) NOT NULL,
    "companyName" VARCHAR(100) NOT NULL,
    "currentPrice" DECIMAL(10,2),
    "lastUpdated" TIMESTAMP(3),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_ticker_key" ON "Stock"("ticker");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
