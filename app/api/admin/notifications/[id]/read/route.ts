import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const event = await prisma.event.findUnique({ where: { id: params.id } });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let meta = {};
    if (event.metadata) {
        try { meta = JSON.parse(String(event.metadata)); } catch(_) {}
    }

    await prisma.event.update({
        where: { id: params.id },
        data: {
            metadata: JSON.stringify({ ...meta, read: true })
        }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
