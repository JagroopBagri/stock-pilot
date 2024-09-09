import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { verifyAuth } from "@/utils/server/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("user-token")?.value || "";

    const validationResp = await verifyAuth(token);

    if (!validationResp.success) {
      throw new Error(validationResp.message);
    }

    const url = new URL(req.url);
    const ticker = url.searchParams.get('ticker');

    if (!ticker) {
      return NextResponse.json({ error: "Ticker parameter is required" }, { status: 400 });
    }

    const polygonApiKey = process.env.POLYGON_API_KEY;
    if (!polygonApiKey) {
      throw new Error("Polygon API key is not set in the environment variables");
    }

    const polygonUrl = `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${polygonApiKey}`;

    const response = await axios.get(polygonUrl);

    if (response.data && response.data.results) {
      return NextResponse.json({ 
        message: 'Stock details fetched successfully', 
        data: response.data.results 
      });
    } else {
      return NextResponse.json({ 
        error: 'No stock details found for the specified ticker' 
      }, { status: 404 });
    }

  } catch (error: any) {
    console.error("Error fetching stock details:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({
        error: `Polygon API Error: ${error.response.status} - ${error.response.data.error}`
      }, { status: error.response.status });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
