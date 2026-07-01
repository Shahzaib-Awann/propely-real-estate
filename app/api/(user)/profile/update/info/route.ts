// app/api/profile/update/info/route.ts

import { NextRequest, NextResponse } from "next/server";
import { UpdateUserProfileFormSchema } from "@/lib/zod/schema.zod";
import { updateUserProfileInfo } from "@/lib/actions/user.action";
import { auth } from "@/auth";
import { ZodError } from "zod";



/*=====================================
=== [POST] Update user profile info ===
=====================================*/
export async function POST(req: NextRequest) {
  try {
    // === Authenticate User ===
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    // === Parse & Validate Request Body ===
    const body = await req.json();
    const { name, email } = UpdateUserProfileFormSchema.parse(body);

    // === Update user profile ===
    await updateUserProfileInfo(Number(userId), name, email);

    // === Success ===
    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    // === Validation errors ===
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid form data." },
        { status: 422 },
      );
    }

    // === Known service errors ===
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 },
        );
      }

      if (error.message === "DUPLICATE_VALUE") {
        return NextResponse.json(
          { error: "Duplicate value exists" },
          { status: 409 },
        );
      }
    }

    // === Unexpected error ===
    console.error("[PROFILE_UPDATE_ERROR]", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
