import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/server/prisma";
import { verifyAuth } from "@/utils/server/auth";
import Decimal from "decimal.js";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get("user-token")?.value || "";
    const validationResp = await verifyAuth(token);

    if (!validationResp.success) {
      throw new Error(validationResp.message);
    }

    const userId = validationResp.id;
    const purchaseTradeId = parseInt(params.id);
    
    const {
      stockId,
      quantity,
      price,
      date,
      notes,
      netProfit = 0,
    } = await req.json();

    const purchaseTrade = await prisma.purchaseTrade.findUnique({
      where: { id: purchaseTradeId },
      include: { saleTrades: true },
    });

    if (!purchaseTrade || purchaseTrade.userId !== userId) {
      throw new Error("Purchase trade not found or unauthorized");
    }

    // calculate the total quantity of all connected sale trades
    const totalSaleQuantity = purchaseTrade.saleTrades.reduce((sum, saleTrade) => sum + saleTrade.quantity, 0);

    // check if the new quantity is less than the sum of the sale trades quantities
    if (totalSaleQuantity > quantity) {
      return NextResponse.json(
        { error: "The total quantity of connected sale trades exceeds the new purchase trade quantity." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (prisma) => {
      // Update the purchase trade
      await prisma.purchaseTrade.update({
        where: { id: purchaseTradeId },
        data: {
          userId,
          stockId,
          quantity,
          price,
          totalAmount: quantity * price,
          notes,
          netProfit,
          updatedAt: new Date(),
          date: new Date(date),
        },
      });

      // Update all related saleTrades
      const updatedSaleTrades = purchaseTrade.saleTrades.map((saleTrade) => {
        const newTotalAmount = new Decimal(saleTrade.sellPrice).times(saleTrade.quantity).toFixed(2);
        const newNetProfit = new Decimal(saleTrade.sellPrice)
          .minus(price) 
          .times(saleTrade.quantity)
          .toFixed(2);

        return prisma.saleTrade.update({
          where: { id: saleTrade.id },
          data: {
            totalAmount: newTotalAmount,
            netProfit: newNetProfit,
            updatedAt: new Date(),
          },
        });
      });

      await Promise.all(updatedSaleTrades);
    });

    return NextResponse.json({
      message: "Purchase trade updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating purchase trades: ", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get("user-token")?.value || "";
    const validationResp = await verifyAuth(token);

    if (!validationResp.success) {
      throw new Error(validationResp.message);
    }

    const userId = validationResp.id;
    const purchaseTradeId = parseInt(params.id);

    const purchaseTrade = await prisma.purchaseTrade.findUnique({
      where: { id: purchaseTradeId },
      include: { saleTrades: true },
    });

    if (!purchaseTrade || purchaseTrade.userId !== userId) {
      throw new Error("Purchase trade not found or unauthorized");
    }

    // Delete the purchase trade
    await prisma.purchaseTrade.delete({
      where: { id: purchaseTradeId },
    });

    return NextResponse.json({
      message: "Purchase trade deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting purchase trade: ", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
