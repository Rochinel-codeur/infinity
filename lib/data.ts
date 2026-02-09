import prisma from "@/lib/prisma";

export async function getActiveTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function getActiveVideos() {
  try {
    return await prisma.video.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export async function getActiveScreenshots() {
  try {
    return await prisma.winningScreenshot.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching screenshots:", error);
    return [];
  }
}

export async function getPromoCode() {
  try {
    // Assuming single or main promo code logic, or fetching first active
    const promo = await prisma.promoCode.findFirst({
      where: { isActive: true },
    });
    return promo?.code || "BCC123";
  } catch (error) {
    return "BCC123";
  }
}
