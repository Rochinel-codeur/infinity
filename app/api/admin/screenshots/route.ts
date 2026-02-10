import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

async function uploadFile(file: File) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
    const uploadDir = join(process.cwd(), "public/uploads");
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (e) {
    console.error("Upload error", e);
    return null;
  }
}

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const screenshots = await prisma.winningScreenshot.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ screenshots });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    const amount = formData.get("amount") as string;
    const time = formData.get("time") as string;
    const type = formData.get("type") as string || "win";
    const isActive = formData.get("isActive") === "true";
    
    let imageUrl = formData.get("imageUrl") as string;
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      const uploaded = await uploadFile(file);
      if (uploaded) imageUrl = uploaded;
    }

    const screenshot = await prisma.winningScreenshot.create({
      data: {
        name,
        message,
        amount,
        time,
        type,
        isActive,
        imageUrl,
      },
    });

    return NextResponse.json({ screenshot });
  } catch (e: unknown) {
    console.error("Create error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const contentType = request.headers.get("content-type") || "";
    let id: string;
    const data: Prisma.WinningScreenshotUpdateInput = {};

    if (contentType.includes("application/json")) {
      const json = await request.json();
      id = json.id;
      if (json.isActive !== undefined) data.isActive = json.isActive;
      if (json.name) data.name = json.name;
      if (json.message) data.message = json.message;
      if (json.amount) data.amount = json.amount;
      if (json.time) data.time = json.time;
      if (json.type) data.type = json.type;
    } else {
      const formData = await request.formData();
      id = formData.get("id") as string;
      
      const name = formData.get("name") as string;
      if (name) data.name = name;
      
      const message = formData.get("message") as string;
      if (message) data.message = message;
      
      const amount = formData.get("amount") as string;
      if (amount) data.amount = amount;
      
      const time = formData.get("time") as string;
      if (time) data.time = time;

      const type = formData.get("type") as string;
      if (type) data.type = type;
      
      const isActive = formData.get("isActive");
      if (isActive !== null) data.isActive = isActive === "true";

      let imageUrl = formData.get("imageUrl") as string;
      const file = formData.get("file") as File | null;

      if (file && file.size > 0) {
        const uploaded = await uploadFile(file);
        if (uploaded) imageUrl = uploaded;
      }
      if (imageUrl) data.imageUrl = imageUrl;
    }

    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const screenshot = await prisma.winningScreenshot.update({
      where: { id },
      data,
    });

    return NextResponse.json({ screenshot });
  } catch (e: unknown) {
    console.error("Update error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    await prisma.winningScreenshot.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
