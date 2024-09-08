import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/server/prisma";
import { verifyAuth } from "@/utils/server/auth";
import Decimal from "decimal.js";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get("user-token")?.value || "";
    const validationResp = await verifyAuth(token);

    if (!validationResp.success) {
      throw new Error(validationResp.message);
    }

    const userId = validationResp.id;
    const saleTradeId = parseInt(params.id);

    // Fetch the updated data from the request body
    const { quantity, sellPrice, date, notes, netProfit, totalAmount } = await req.json();

    const saleTrade = await prisma.saleTrade.findUnique({
      where: { id: saleTradeId },
      include: { purchaseTrade: true },
    });

    if (!saleTrade || saleTrade.userId !== userId) {
      throw new Error("Sale trade not found or unauthorized");
    }

    // if the quantity exceeds the amount of purchase trade shares available then throw an error
    const purchaseTrade = saleTrade.purchaseTrade;
    const differenceInQuantity = quantity - saleTrade.quantity;

    // If the updated quantity exceeds available in the purchase trade, handle accordingly
    if (differenceInQuantity > purchaseTrade.quantity) {
      throw new Error(
        "Quantity exceeds available shares from the purchase trade"
      );
    }

    // Start transaction to update the sale trade and adjust the purchase trade quantity if necessary
    await prisma.$transaction(async (transaction) => {
      // Update the sale trade with new data
      await transaction.saleTrade.update({
        where: { id: saleTradeId },
        data: {
          quantity,
          sellPrice,
          totalAmount,
          netProfit,
          date: new Date(date),
          notes,
        },
      });

      await transaction.purchaseTrade.update({
        where: { id: purchaseTrade.id },
        data: {
          quantity: purchaseTrade.quantity - differenceInQuantity, 
        },
      });
    });

    return NextResponse.json({
      message: "Sale trade updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating sale trade: ", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get("user-token")?.value || "";
    const validationResp = await verifyAuth(token);
    if (!validationResp.success) {
      throw new Error(validationResp.message);
    }

    const userId = validationResp.id;
    const saleTradeId = parseInt(params.id);

    const saleTrade = await prisma.saleTrade.findUnique({
      where: { id: saleTradeId },
      include: { purchaseTrade: true },
    });

    if (!saleTrade || saleTrade.userId !== userId) {
      throw new Error("Sale trade not found or unauthorized");
    }
    // using a transaction to make sure that both update and delete succeed or fail together
    await prisma.$transaction(async (transaction) => {
      // add the quantity back to the purchase trade
      await transaction.purchaseTrade.update({
        where: { id: saleTrade.purchaseTradeId },
        data: {
          quantity: saleTrade.purchaseTrade.quantity + saleTrade.quantity,
        },
      });

      // delete the sale trade
      await transaction.saleTrade.delete({
        where: { id: saleTradeId },
      });
    });

    return NextResponse.json({
      message: "Sale trade deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
