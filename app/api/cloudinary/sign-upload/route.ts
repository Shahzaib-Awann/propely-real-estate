// app/api/cloudinary/sign-upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";



/** Cloudinary Configuration (Server-only) */
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



/*=================================================
=== [POST] Generate Cloudinary Upload Signature ===
================================================ */
export async function POST(req: NextRequest) {
  try {
    // === Authenticate User ===
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // === Parse & Validate Request Body ===
    const body = await req.json();
    const { paramsToSign } = body;

    if (!paramsToSign) {
      return NextResponse.json(
        { error: "Missing parameters (paramsToSign) for upload." },
        { status: 400 }
      );
    }

    // === Ensure Secret Key is Available ===
    const secret = process.env.CLOUDINARY_API_SECRET;
    if (!secret) {
      console.error("CLOUDINARY_API_SECRET is not set");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    // === Generate Signature ===
    const signature = cloudinary.utils.api_sign_request(paramsToSign, secret);

    // === Return Success ===
    return Response.json({ signature });

  } catch (error) {
    console.error("Failed to generate upload signature:", error);
    return NextResponse.json(
      { error: "Could not generate upload signature" },
      { status: 500 }
    );
  }
}
