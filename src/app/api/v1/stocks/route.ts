import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/server/prisma";

export async function GET(req: NextRequest) {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: {
        ticker: 'asc',
      },
    });

    return NextResponse.json({
      message: "Stocks fetched successfully",
      data: stocks,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}