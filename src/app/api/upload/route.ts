import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Directory structure: public/uploads/[userId]
    const uploadDir = path.join(process.cwd(), "public", "uploads", session.user.id);

    try {
        await mkdir(uploadDir, { recursive: true });

        // Create unique filename: timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // Return relative path for storage
        const fileUrl = `/uploads/${session.user.id}/${filename}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
    }
}
