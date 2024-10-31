// app/api/uploads/[...path].js
import { createReadStream } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json({
        success: false,
        message: "File not specified",
      });
    }

    const path = join(process.cwd(), "uploads", filename);
    const stream = createReadStream(path);

    return new NextResponse(stream, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve file",
    });
  }
}
