import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/server/prisma";
import { verifyAuth } from "@/utils/server/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("user-token")?.value || "";

    const validationResp = await verifyAuth(token);

    if (!validationResp.success) {
      throw new Error(validationResp.message);
    }

    const userId = validationResp.id;

    const purchasedTrades = await prisma.purchaseTrade.findMany({
      where: {
        userId: userId,
        quantity: {
          gt: 0, // only retrieve purchasedTrades with a quantity greater than 0
        },
      },
      include: {
        stock: true,
        saleTrades: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      message: "Trades fetched successfully",
      data: purchasedTrades,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("user-token")?.value || "";
    const validationResp = await verifyAuth(token);

    if (!validationResp.success) {
      throw new Error(validationResp.message);
    }

    const userId = validationResp.id;
    const {
      stockId,
      quantity,
      price,
      date,
      notes,
      netProfit = 0,
    } = await req.json();

    const trade = await prisma.purchaseTrade.create({
      data: {
        userId,
        stockId,
        quantity,
        price,
        totalAmount: quantity * price,
        date: new Date(date),
        notes,
        netProfit,
      },
    });

    return NextResponse.json({
      message: "Trade created successfully",
      data: trade,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
