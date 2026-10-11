import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif", "image/avif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format gambar tidak didukung. Gunakan JPG, PNG, WebP, SVG, AVIF, atau GIF." },
        { status: 400 }
      );
    }

    // Limit size 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate safe clean filename
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const timestamp = Date.now();
    const fileName = `${baseName}-${timestamp}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah gambar" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { readdir, stat } = await import("fs/promises");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const files = await readdir(uploadsDir);
    const mediaList = [];

    for (const file of files) {
      if (file.startsWith(".")) continue;
      const filePath = path.join(uploadsDir, file);
      try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
          mediaList.push({
            name: file,
            url: `/uploads/${file}`,
            size: stats.size,
            createdAt: stats.birthtime,
          });
        }
      } catch {
        // ignore individual file error
      }
    }

    // Sort newest first
    mediaList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ media: mediaList });
  } catch (error) {
    console.error("Media list error:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar media" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { unlink } = await import("fs/promises");
    const { fileName } = await request.json();

    if (!fileName || fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
      return NextResponse.json({ error: "Nama file tidak valid" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    await unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 });
  }
}

