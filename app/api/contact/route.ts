import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, subject, body } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Nama lengkap wajib diisi" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Alamat email tidak valid" }, { status: 400 });
    }
    if (!body || !body.trim() || body.trim().length < 5) {
      return NextResponse.json({ error: "Pesan minimal 5 karakter" }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject ? subject.trim() : null,
        body: body.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pesan Anda berhasil dikirim! Saya akan segera merespons.",
      id: newMessage.id,
    });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Gagal mengirim pesan" }, { status: 500 });
  }
}

