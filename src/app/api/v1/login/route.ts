import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/server/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    const { email, password } = body;
    // check if the user already exists
    const user = await prisma.users.findFirst({
        where: {
            email: email
        }
    });
    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist" },
        { status: 400 },
      );
    }

    // check if the password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 },
      );
    }

    // after we verified the user is valid, we can create a JWT token and return it to the user cookies
    // first create token data
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const jwtSecret = process.env.JWT_TOKEN_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT token secret is undefined. Make sure JWT_TOKEN_SECRET is set.");
    }

    const token = jwt.sign(tokenData, jwtSecret, {
      expiresIn: "7d",
    });

    // create a next response
    const response = NextResponse.json({
      message: "Logged in successfully",
      success: true,
    });
    // set this token in the user cookies
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}