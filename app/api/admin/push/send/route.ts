
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import webpush from "web-push";
import { getAdminFromCookies } from "@/lib/auth";

// Configure Web Push (using dummy keys if not present, user should set them)
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BGt6...";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "v1...";

webpush.setVapidDetails(
  "mailto:admin@methode-certifiee.com",
  vapidPublicKey,
  vapidPrivateKey
);

export async function POST(req: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, body, url } = await req.json();

    const subscriptions = await prisma.pushSubscription.findMany();
    
    const notificationPayload = JSON.stringify({
      title,
      body,
      url,
    });

    const sendPromises = subscriptions.map((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webpush.sendNotification(pushSubscription, notificationPayload)
        .catch(err => {
            if (err.statusCode === 410 || err.statusCode === 404) {
                // Subscription has expired or is no longer valid
                return prisma.pushSubscription.delete({ where: { id: sub.id } });
            }
            console.error("Error sending push:", err);
        });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, sentCount: subscriptions.length });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
