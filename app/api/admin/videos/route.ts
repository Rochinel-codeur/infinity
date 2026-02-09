import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET(_request: NextRequest) {
  const admin = await getAdminFromCookies();
  
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const videos = await prisma.video.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Videos fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}



export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    let url = formData.get("url") as string;
    const file = formData.get("file") as File | null;
    const thumbnailFile = formData.get("thumbnailFile") as File | null;
    let thumbnailUrl = formData.get("thumbnailUrl") as string;

    const uploadDir = join(process.cwd(), "public/uploads/videos");
    await mkdir(uploadDir, { recursive: true });

    if (thumbnailFile) {
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const name = `thumb-${Date.now()}-${thumbnailFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      await writeFile(join(uploadDir, name), buffer);
      thumbnailUrl = `/uploads/videos/${name}`;
    }

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      url = `/uploads/videos/${filename}`;
    }

    const video = await prisma.video.create({
      data: {
        title,
        url,
        thumbnailUrl: thumbnailUrl || null,
        isActive: true, // Default active
        order: 0,
      },
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Video create error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminFromCookies();
  
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const video = await prisma.video.update({
      where: { id: data.id },
      data: {
        title: data.title,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        isActive: data.isActive,
        order: data.order,
      },
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Video update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminFromCookies();
  
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await prisma.video.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
