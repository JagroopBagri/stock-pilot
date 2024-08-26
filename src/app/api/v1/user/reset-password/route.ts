import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/server/prisma";
import bcrypt from "bcrypt";
import { verifyAuth } from "@/utils/server/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing token or password" },
        {
          status: 400,
        }
      );
    }

    const validationResp = await verifyAuth(token);
    const verifiedToken = validationResp.success;
    const tokenId = validationResp.id;

    if (!verifiedToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        {
          status: 401,
        }
      );
    }

    const userResponse = await prisma.user.findFirst({
      where: {
        AND: [
          {
            id: tokenId,
          },
          {
            forgotPasswordToken: token,
          },
        ],
      },
    });

    if (!userResponse) {
      return NextResponse.json(
        { error: "No user found with the provided token" },
        {
          status: 404,
        }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: {
        id: userResponse.id,
      },
      data: {
        password: hashedPassword,
        forgotPasswordToken: null
      },
    });

    // Successfully updated user password
    return NextResponse.json({ message: "Password updated successfully" },{
      status: 200,
    });
  } catch (error) {
    console.error("Error updating password: ", error);
    return NextResponse.json(
      { error: "An error occurred while updating the password." },
      {
        status: 500,
      }
    );
  }
}
