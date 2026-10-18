import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import path from "path";

const BUCKET = "uploads";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env variables not set");
  return createClient(url, key);
}

// 1. Endpoint untuk membuat Signed Upload URL (Supabase Direct Upload)
// Solusi ini bypass batas 4.5MB Vercel serverless request body!
export async function PUT(request: Request) {
  try {
    const { fileName: originalName, fileType } = await request.json();

    if (!originalName) {
      return NextResponse.json({ error: "Nama file tidak valid" }, { status: 400 });
    }

    const ext = (path.extname(originalName) || "").toLowerCase();
    const safeExt = ext || ".jpg";
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const timestamp = Date.now();
    const fileName = `${baseName || "image"}-${timestamp}${safeExt}`;

    const supabase = getSupabase();

    // Buat signed upload URL dari Supabase (berlaku 10 menit)
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(fileName);

    if (error || !data) {
      console.error("Gagal membuat signed URL:", error);
      return NextResponse.json(
        { error: `Gagal mempersiapkan upload: ${error?.message || "Unknown error"}` },
        { status: 500 }
      );
    }

    // Ambil public URL yang akan digunakan setelah upload selesai
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      fileName,
      publicUrl: urlData.publicUrl,
    });
  } catch (error) {
    console.error("Signed URL error:", error);
    return NextResponse.json(
      { error: "Gagal memproses permintaan upload" },
      { status: 500 }
    );
  }
}

// 2. Standar POST upload (fallback jika dibutuhkan)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // Validate image by mime type or file extension
    const mime = (file.type || "").toLowerCase();
    const ext = (path.extname(file.name) || "").toLowerCase();
    const validExts = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".avif", ".ico", ".bmp", ".tiff", ".heic", ".heif"];
    const isImageMime = mime.startsWith("image/");
    const isValidExt = validExts.includes(ext);

    if (!isImageMime && !isValidExt) {
      return NextResponse.json(
        { error: "Format gambar tidak didukung. Gunakan JPG, PNG, WebP, SVG, AVIF, atau GIF." },
        { status: 400 }
      );
    }

    // Limit size 25MB
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran gambar terlalu besar. Maksimal 25MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe clean filename
    const safeExt = ext || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const timestamp = Date.now();
    const fileName = `${baseName || "image"}-${timestamp}${safeExt}`;

    const supabase = getSupabase();

    // Upload ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: mime || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: `Gagal mengunggah ke storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Dapatkan public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

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
    const supabase = getSupabase();

    const { data: files, error } = await supabase.storage.from(BUCKET).list("", {
      limit: 200,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("Media list error:", error);
      return NextResponse.json({ error: "Gagal mengambil daftar media" }, { status: 500 });
    }

    const mediaList = (files || [])
      .filter((f) => !f.name.startsWith("."))
      .map((f) => {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
        return {
          name: f.name,
          url: urlData.publicUrl,
          size: f.metadata?.size ?? 0,
          createdAt: f.created_at,
        };
      });

    return NextResponse.json({ media: mediaList });
  } catch (error) {
    console.error("Media list error:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar media" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { fileName } = await request.json();

    if (!fileName || fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
      return NextResponse.json({ error: "Nama file tidak valid" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase.storage.from(BUCKET).remove([fileName]);

    if (error) {
      console.error("Media delete error:", error);
      return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 });
  }
}
