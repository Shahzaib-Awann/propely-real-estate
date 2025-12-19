// app/api/profile/update/info/route.ts

import { NextRequest, NextResponse } from "next/server";
import { UpdateUserProfileFormSchema } from "@/lib/zod/schema.zod";
import { updateUserProfileInfo } from "@/lib/actions/user.action";
import { auth } from "@/auth";
import { ZodError } from "zod";



/*========================================================================
=== [POST] Updates user profile information with auth & error handling ===
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
    const { name, email } = UpdateUserProfileFormSchema.parse(body)

    // === Update user profile ===
    const result = await updateUserProfileInfo(
      Number(userId),
      name,
      email
    )

    // === Handle DB-layer result (includes duplicate email) ===
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status } // 404 | 409
      )
    }

    // === Success ===
    return NextResponse.json(
      { message: result.message },
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
    console.error("Profile update failed:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}