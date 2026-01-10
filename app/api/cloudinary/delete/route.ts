// app/api/cloudinary/delete/route.ts

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";



/** Cloudinary Configuration (Server-only) */
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



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

        // === Delete the assets from Cloudinary using the publicId in parallel. ===
        const results = await Promise.all(idsToDelete.map((id) => cloudinary.uploader.destroy(id)));

        // === Return Success ===
        return NextResponse.json({ success: true, deletedCount: results.length, results });
    } catch (error) {
        console.error("Cloudinary delete failed:", error);
        return NextResponse.json(
            { error: "Failed to delete assets(s)" },
            { status: 500 }
        );
    }
}
