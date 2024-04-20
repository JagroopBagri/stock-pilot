import { jwtVerify } from 'jose';
import { UserJWTPayload } from "@/utils/server/types";

type VerifyAuthResp = {
  success: boolean;
  id: number;
  message: string;
};

export const verifyAuth = async (token: string): Promise<VerifyAuthResp> => {
  try {
    const jwtSecret = process.env.JWT_TOKEN_SECRET;
    if (!jwtSecret) {
      return {
        message:
          "JWT token secret is undefined. Make sure JWT_TOKEN_SECRET is set.",
        success: false,
        id: -1,
      };
    }

    // The `jwtVerify` function returns a Promise that resolves with the decoded token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret));

    const decoded = payload as UserJWTPayload;

    return {
      message: "Successfully validated",
      success: true,
      id: decoded.id,
    };
  } catch (error: any) {
    if(error.code === 'ERR_JWS_INVALID'){
      return {
        message: error.message || "Your token has expired or is invalid.",
        success: false,
        id: -1,
      };
    }
    console.error("Invalid token - verifyAuth");
    return {
      message: error.message || "Error in validating token",
      success: false,
      id: -1,
    };
  }
};
