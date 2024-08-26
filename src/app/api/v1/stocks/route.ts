import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/server/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const search = url.searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const stocks = await prisma.stock.findMany({
      where: {
        OR: [
          { ticker: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } }
        ]
      },
      orderBy: {
        ticker: 'asc',
      },
      take: limit,
      skip: skip,
    });

    const total = await prisma.stock.count({
      where: {
        OR: [
          { ticker: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } }
        ]
      },
    });

    return NextResponse.json({
      message: "Stocks fetched successfully",
      data: stocks,
      meta: {
        total,
        page,
        limit,
        hasMore: skip + stocks.length < total
      }
    });
  } catch (error: any) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}