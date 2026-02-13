import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { triggerAdminRevalidate } from "@/lib/adminRevalidate";
import { ensureDefaultTextTestimonials } from "@/lib/defaultTestimonials";
import { Prisma } from "@prisma/client";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const admin = await getAdminFromCookies();
  
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    await ensureDefaultTextTestimonials();

    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ testimonials });
  } catch (_error) {
    console.error("Testimonials fetch error:", _error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}



async function uploadFile(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
  const uploadDir = join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const text = formData.get("text") as string;
    const date = formData.get("date") as string;
    const source = formData.get("source") as string;
    const rating = parseInt(formData.get("rating") as string) || 5;
    const isActive = formData.get("isActive") === "true";
    const order = parseInt(formData.get("order") as string) || 0;
    
    let imageUrl = formData.get("imageUrl") as string;
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      imageUrl = await uploadFile(file);
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        text,
        date: new Date(date),
        source: source || "WhatsApp",
        imageUrl,
        rating,
        isActive,
        order,
      },
    });

    await triggerAdminRevalidate(request, {
      tags: ["content:home", "content:testimonials"],
      paths: ["/"],
    });

    return NextResponse.json({ testimonial });
  } catch (_error) {
    console.error("Testimonial create error:", _error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const contentType = request.headers.get("content-type") || "";
    let id: string;
    const data: Prisma.TestimonialUpdateInput = {};

    if (contentType.includes("application/json")) {
      const json = await request.json();
      id = json.id;
      // Handle partial updates from JSON
      if (json.isActive !== undefined) data.isActive = json.isActive;
      if (json.name) data.name = json.name;
      if (json.text) data.text = json.text;
      if (json.date) data.date = new Date(json.date);
      if (json.order !== undefined) data.order = json.order;
    } else {
      const formData = await request.formData();
      id = formData.get("id") as string;
      
      const name = formData.get("name") as string;
      if (name) data.name = name;
      
      const text = formData.get("text") as string;
      if (text) data.text = text;
      
      const date = formData.get("date") as string;
      if (date) data.date = new Date(date);
      
      const source = formData.get("source") as string;
      if (source) data.source = source;
      
      const rating = formData.get("rating");
      if (rating) data.rating = parseInt(rating as string);
      
      const isActive = formData.get("isActive");
      if (isActive !== null) data.isActive = isActive === "true";
      
      const order = formData.get("order");
      if (order) data.order = parseInt(order as string);

      let imageUrl = formData.get("imageUrl") as string;
      const file = formData.get("file") as File | null;

      if (file && file.size > 0) {
        imageUrl = await uploadFile(file);
      }
      if (imageUrl) data.imageUrl = imageUrl;
    }

    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });

    await triggerAdminRevalidate(request, {
      tags: ["content:home", "content:testimonials"],
      paths: ["/"],
    });

    return NextResponse.json({ testimonial });
  } catch (_error) {
    console.error("Testimonial update error:", _error);
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

    await prisma.testimonial.delete({ where: { id } });

    await triggerAdminRevalidate(request, {
      tags: ["content:home", "content:testimonials"],
      paths: ["/"],
    });

    return NextResponse.json({ success: true });
  } catch (_error) {
    console.error("Testimonial delete error:", _error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
