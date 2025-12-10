// app/api/auth/sign-up/route.ts

import { NextRequest, NextResponse } from "next/server";
import { SignUpFormSchema } from "@/lib/zod/schema.zod";
import { createUserForSignUp } from "@/lib/actions/user.action";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";


/*===================================================================
=== [GET] Handles user sign-up, auto-sign-in, and error responses ===
================================================================== */
export async function POST(req: NextRequest) {
  try {

    // === Parse & Validate Request Body ===
    const body = await req.json();
    const { name, email, password } = SignUpFormSchema.parse(body);

    // === Adds a new user to the database, errors if email exists ===
    await createUserForSignUp(name, email, password);

    // === Tries auto-login after sign-up, returns AUTO_LOGIN_FAILED on failure ===
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (err) {
      if (err instanceof AuthError) {
        // signup succeeded, auto-login failed
        return NextResponse.json(
          { error: "AUTO_LOGIN_FAILED" },
          { status: 200 }
        );
      }

      throw err; // unknown error -> outer catch
    }

    // === Success Response ===
    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error: unknown) {

    // === Handles errors: 409 for duplicate email, 400 for others ===
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
}