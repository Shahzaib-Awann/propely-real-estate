// app/api/cloudinary/delete/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteCloudinaryAssets } from "@/lib/actions/cloudinary.action";



/*===========================================================
=== [POST] Deletes a Cloudinary asset using its publicId. ===
========================================================== */
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
        const { publicId } = body; // Accepts: publicId: string | string[]

        const idsToDelete: string[] =
            typeof publicId === "string"
                ? [publicId]
                : Array.isArray(publicId)
                    ? publicId
                    : [];

        if (!idsToDelete.length) {
            return NextResponse.json({ error: "Invalid publicId(s)" }, { status: 400 });
        }

        // === Delete the assets from Cloudinary using the publicId. ===
        const result = await deleteCloudinaryAssets(idsToDelete);

        // === Return Success ===
        return NextResponse.json(result);
    } catch (error) {
        console.error("Cloudinary delete failed:", error);
        return NextResponse.json(
            { error: "Failed to delete assets(s)" },
            { status: 500 }
        );
    }
}
