import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../utils/server/prisma';
import axios from "axios";

async function fetchAllStocks(polygonApiKey: string) {
  let allStocks: any[] = [];
  let nextUrl = `https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&sort=ticker&order=asc&limit=1000&apiKey=${polygonApiKey}`;

  while (nextUrl) {
    try {
      const response = await axios.get(nextUrl);
      allStocks = allStocks.concat(response.data.results);
      nextUrl = response.data.next_url;

      if (nextUrl) {
        // Add the API key to the next_url
        nextUrl = `${nextUrl}&apiKey=${polygonApiKey}`;
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Error fetching stocks: ${error.response.status} - ${error.response.data.error}`);
      } else {
        console.error("Error fetching stocks:", error);
      }
      break;
    }
  }

  return allStocks;
}

async function updateStocks() {
  try {
    const polygonApiKey = process.env.POLYGON_API_KEY;
    if (!polygonApiKey) {
      throw new Error("Polygon API key is not set in the environment variables");
    }

    const stocks = await fetchAllStocks(polygonApiKey);

    console.log(`Fetched ${stocks.length} stocks`);

    for (const stock of stocks) {
      await prisma.stock.upsert({
        where: { ticker: stock.ticker },
        update: {
          companyName: stock.name,
          updatedAt: new Date(),
        },
        create: {
          ticker: stock.ticker,
          companyName: stock.name,
        },
      });
    }

    console.log("Stocks updated successfully");
    return { success: true, message: `${stocks.length} stocks updated successfully` };
  } catch (error) {
    console.error("Error updating stocks:", error);
    return { success: false, message: error instanceof Error ? error.message : "Error updating stocks" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  const result = await updateStocks();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

export async function POST(request: NextRequest) {
  const result = await updateStocks();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

// This allows the function to be imported and run manually
export { updateStocks };