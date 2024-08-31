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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
