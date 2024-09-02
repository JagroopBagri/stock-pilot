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

    // Extract query parameters
    const ticker = req.nextUrl.searchParams.get("ticker");

    // Build the `where` clause dynamically
    const whereClause: any = {
      userId: userId,
    };

    if (ticker) {
      whereClause.purchaseTrade = {
        stock: {
          ticker: {
            contains: ticker,
            mode: "insensitive",
          },
        },
      };
    }

    const saleTrades = await prisma.saleTrade.findMany({
      where: whereClause,
      include: {
        purchaseTrade: {
          include: {
            stock: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      message: "Sale trades fetched successfully",
      data: saleTrades,
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
      purchaseTradeId,
      quantity,
      sellPrice,
      totalAmount,
      buyPrice,
      netProfit,
      date,
      notes,
    } = await req.json();

    // update quantity of the purchase trade
    const purchaseTrade = await prisma.purchaseTrade.findUnique({
      where: { id: purchaseTradeId },
    });

    if (!purchaseTrade || purchaseTrade.quantity < quantity) {
      throw new Error("Invalid quantity");
    }

    let saleTrade;

    await prisma.$transaction(async (transaction) => {
      // subtract the quantity from the connected purchase trade
      await transaction.purchaseTrade.update({
        where: { id: purchaseTradeId },
        data: { quantity: purchaseTrade.quantity - quantity },
      });

      // create the sale trade
      saleTrade = await transaction.saleTrade.create({
        data: {
          userId,
          purchaseTradeId,
          quantity,
          sellPrice,
          totalAmount,
          buyPrice,
          netProfit,
          date: new Date(date),
          notes,
        },
      });
    });

    return NextResponse.json({
      message: "Sale trade created successfully",
      data: saleTrade,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
