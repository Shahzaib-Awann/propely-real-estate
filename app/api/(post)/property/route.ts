// app/api/(post)/property/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePostSchema } from "@/lib/zod/schema.zod";
import { auth } from "@/auth";
import { ZodError } from "zod";
import { addNewProperty } from "@/lib/actions/property.action";



/*========================================================================
=== [POST] Add New Property ===
======================================================================= */
export async function POST(req: NextRequest) {
  try {
    // === Authenticate User ===
    const session = await auth()
    const userId = session?.user.id

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      )
    }

    // === Parse & Validate Request Body ===
    const body = await req.json()
    const { postData, postImages, postDetails, postFeatures } = createOrUpdatePostSchema.parse(body)

    const result = await addNewProperty(
        Number(userId),
        postData,
        postImages,
        postDetails,
        postFeatures
    )

    // === Success ===
    return NextResponse.json(
      { message: "Successfull Added New Property", propertyId: result.propertyId },
      { status: 200 }
    )
  } catch (error: unknown) {

    // === Validation errors ===
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid form data." },
        { status: 422 }
      )
    }

    // === Unexpected error ===
    console.error("Property Added failed:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}