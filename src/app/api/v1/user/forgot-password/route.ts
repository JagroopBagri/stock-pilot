import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/server/prisma";
import { SignJWT } from "jose";
import { UserJWTPayload } from "@/utils/server/types";
import sendBrevoEmail from "@/utils/server/email/sendEmail";
import createForgotPasswordHTMLTemplate from "@/utils/server/email/htmlTemplates/forgotPasswordTemplate";

const JWT_SECRET = process.env.JWT_TOKEN_SECRET;
const BREVO_EMAIL = process.env.BREVO_EMAIL;
const NODE_ENV = process.env.NODE_ENV;

export async function POST(request: NextRequest) {
  if (!JWT_SECRET || !BREVO_EMAIL || !NODE_ENV) {
    throw new Error("Server configuration error. Missing env variables.");
  }

  try {
    const body = await request.json();

    const { email } = body;

    // check if a user with that email exists
    let user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      // After verifying the user is valid, create a JWT token
      const tokenData: UserJWTPayload = { id: user.id };
      const encoder = new TextEncoder();

      const token = await new SignJWT({ ...tokenData })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("15minutes")
        .sign(encoder.encode(JWT_SECRET));

      // add the token to the users forgotPasswordToken
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          forgotPasswordToken: token,
        },
      });

      // Set up email params
      const isDev = NODE_ENV === "development";
      const baseURL = isDev ? `http://localhost:3000` : `http://localhost:3000`;
      const resetPasswordLink = `${baseURL}/reset-password?reset_token=${token}`;
      const toEmail = user.email;
      const toName = `${user.firstName} ${user.lastName}`;
      const fromEmail = BREVO_EMAIL;
      const fromName = "Stock Pilot";

      const htmlContent = createForgotPasswordHTMLTemplate(
        user.firstName,
        resetPasswordLink
      );
      await sendBrevoEmail({
        toEmail,
        toName,
        fromEmail,
        fromName,
        htmlContent,
        subject: "[Stock Pilot] Password Reset",
      });
    }

    const response = NextResponse.json({
      message: "Forgot password email sent successfully!",
    });
    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Error: Could not send forgot password email" },
      { status: 500 }
    );
  }
}
