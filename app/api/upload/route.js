// app/api/upload/route.ts
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("pdf"); // Expecting 'pdf' as the key in FormData

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define the path where the file will be saved
  const path = join("/tmp", file.name); // Adjust path as needed
  await writeFile(path, buffer);
  console.log(`File saved at ${path}`);

  return NextResponse.json({
    success: true,
    message: "File uploaded successfully",
  });
}
