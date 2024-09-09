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

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const search = url.searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { ticker: { contains: search, mode: "insensitive" } },
          { companyName: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const stocks = await prisma.stock.findMany({
      where: whereClause,
      orderBy: {
        ticker: "asc",
      },
      take: limit,
      skip: skip,
    });

    const total = await prisma.stock.count({
      where: whereClause,
    });

    return NextResponse.json({
      message: "Stocks fetched successfully",
      data: stocks,
      meta: {
        total,
        page,
        limit,
        hasMore: skip + stocks.length < total,
      },
    });
  } catch (error: any) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
