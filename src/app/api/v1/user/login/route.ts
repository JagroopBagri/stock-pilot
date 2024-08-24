import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/server/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { UserJWTPayload } from "@/utils/server/types";

// max age in seconds
const MAX_AGE = 60 * 60 * 24 * 7; // currently 7 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { username, password } = body;
    // check if the user already exists
    let user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          email: username,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist" },
        { status: 400 }
      );
    }

    // check if the password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_TOKEN_SECRET;
    if (!jwtSecret) {
      throw new Error(
        "JWT token secret is undefined. Make sure JWT_TOKEN_SECRET is set."
      );
    }

    // After verifying the user is valid, create a JWT token
    const tokenData: UserJWTPayload = { id: user.id };
    const encoder = new TextEncoder();

    const token = await new SignJWT({ ...tokenData })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(encoder.encode(jwtSecret));

    // Use NextResponse to set the cookie directly
    const response = NextResponse.json({ message: "Logged in successfully!", user });
    response.cookies.set("user-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: MAX_AGE,
      path: "/",
    });
    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
