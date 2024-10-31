import { writeFile, readdir, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";

const uploadsDir = join(process.cwd(), "uploads");

export async function POST(request) {
  try {
    // Ensure the uploads directory exists
    await mkdir(uploadsDir, { recursive: true });

    const data = await request.formData();
    const file = data.get("pdf");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join(uploadsDir, file.name);
    await writeFile(path, buffer);
    console.log(`File saved at ${path}`);

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to upload file",
    });
  }
}

export async function GET() {
  try {
    // Ensure the uploads directory exists
    await mkdir(uploadsDir, { recursive: true });

    // Get list of all files in the uploads directory
    const files = await readdir(uploadsDir);
    // Filter only the PDF files
    const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

    return NextResponse.json({
      success: true,
      count: pdfFiles.length,
      files: pdfFiles,
      message: "Files retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving files:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve files",
    });
  }
}
