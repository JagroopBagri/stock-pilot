import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/server/prisma";
import { verifyAuth } from "@/utils/server/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
          data: { quantity: saleTrade.purchaseTrade.quantity + saleTrade.quantity },
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
