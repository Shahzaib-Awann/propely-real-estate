// app/api/(post)/property/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createOrUpdatePostSchema } from "@/lib/zod/schema.zod";
import { auth } from "@/auth";
import { ZodError } from "zod";
import { addNewProperty, editProperty } from "@/lib/actions/property.action";



/*=============================
=== [POST] Add New Property ===
============================ */
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

    // === Perform Insert Action ===
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



/*=========================
=== [PUT] Edit Property ===
======================== */
export async function PUT(req: NextRequest) {
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
    
    
    // === Perform Edit Action ===
    const result = await editProperty(
        Number(userId),
        postData,
        postImages,
        postDetails,
        postFeatures
    )

    // === Success ===
    return NextResponse.json(
      { message: "Property updated successfully.", propertyId: result.propertyId },
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
    
    if (error instanceof Error && error.message.includes("Property ID is required")) {
      return NextResponse.json(
        { error: "The Property ID is missing. Refresh the page and try again." },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes("not allowed to edit")) {
      return NextResponse.json(
        { error: "You are not allowed to edit this property" },
        { status: 403 }
      );
    }

    // === Unexpected error ===
    console.error("Property update failed.:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}