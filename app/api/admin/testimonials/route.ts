import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromCookies();
  
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Testimonials fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookies();
  
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        text: data.text,
        date: new Date(data.date),
        source: data.source || "WhatsApp",
        imageUrl: data.imageUrl,
        isActive: data.isActive ?? true,
        order: data.order || 0,
      },
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Testimonial create error:", error);
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
    
    const testimonial = await prisma.testimonial.update({
      where: { id: data.id },
      data: {
        name: data.name,
        text: data.text,
        date: data.date ? new Date(data.date) : undefined,
        source: data.source,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        order: data.order,
      },
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Testimonial update error:", error);
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial delete error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
