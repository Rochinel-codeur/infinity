
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    await prisma.pushSubscription.create({
      data: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving subscription:", error);
    // Unique constraint violation
    if ((error as any).code === 'P2002') {
         return NextResponse.json({ success: true, message: "Already subscribed" });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
