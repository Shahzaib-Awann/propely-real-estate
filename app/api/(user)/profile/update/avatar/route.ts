// app/api/profile/update/avatar/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUserAvatar } from "@/lib/actions/cloudinary.action";



/*=============================================================================
=== [POST] Updates a user's avatar and safely cleans up the previous image. ===
============================================================================ */
export async function POST(req: NextRequest) {
    try {
        // === Authenticate user ===
        const session = await auth();
        const userId = Number(session?.user?.id);

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // === Parse body ===
        const { avatarUrl, avatarPublicId } = await req.json();

        if (!avatarUrl || !avatarPublicId) {
            return NextResponse.json(
                { error: "Invalid upload payload" },
                { status: 400 }
            );
        }

        // === Update User Avatar ===
        const result = await updateUserAvatar({
            userId,
            avatarUrl,
            avatarPublicId,
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        // === Success Response ===
        return NextResponse.json(
            { message: "Avatar updated successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Avatar update failed:", error);

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}