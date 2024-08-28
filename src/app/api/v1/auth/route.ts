import { NextResponse } from "next/server";
import { verifyAuth } from "@/utils/server/auth";

// For handling POST requests
export async function POST(req: Request) {
  const body = await req.json();
  const { token } = body;

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const validationResp = await verifyAuth(token);

  if (validationResp.success) {
    return NextResponse.json({ success: true, id: validationResp.id }, { status: 200 });
  } else {
    return NextResponse.json({ success: false, message: validationResp.message }, { status: 401 });
  }
}

// Method not allowed handler for other HTTP methods
export async function handler(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
