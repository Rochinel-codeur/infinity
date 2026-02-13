import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { triggerAdminRevalidate } from "@/lib/adminRevalidate";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const TUTORIAL_VIDEO_SETTING_KEY = "tutorialVideoId";

export async function GET() {
  const admin = await getAdminFromCookies();
  
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const [videos, tutorialSetting] = await Promise.all([
      prisma.video.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.setting.findUnique({
        where: { key: TUTORIAL_VIDEO_SETTING_KEY },
      }),
    ]);

    const tutorialVideoId = tutorialSetting?.value ?? null;
    const videosWithTutorialFlag = videos.map((video) => ({
      ...video,
      isTutorial: video.id === tutorialVideoId,
    }));

    return NextResponse.json({ videos: videosWithTutorialFlag });
  } catch (_error) {
    console.error("Videos fetch error:", _error);
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
    const isTutorial = formData.get("isTutorial") === "true";
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

    if (!title || !url) {
      return NextResponse.json({ error: "Titre et vidéo requis" }, { status: 400 });
    }

    const video = await prisma.$transaction(async (tx) => {
      const createdVideo = await tx.video.create({
        data: {
          title,
          url,
          thumbnailUrl: thumbnailUrl || null,
          isActive: true,
          order: 0,
        },
      });

      if (isTutorial) {
        await tx.setting.upsert({
          where: { key: TUTORIAL_VIDEO_SETTING_KEY },
          update: { value: createdVideo.id },
          create: {
            key: TUTORIAL_VIDEO_SETTING_KEY,
            value: createdVideo.id,
          },
        });
      }

      return createdVideo;
    });

    await triggerAdminRevalidate(request, {
      tags: ["content:home", "content:videos", "settings:tutorial-video"],
      paths: ["/"],
    });

    return NextResponse.json({ video: { ...video, isTutorial } });
  } catch (_error) {
    console.error("Video create error:", _error);
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

    if (!data.id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const updateData: {
      title?: string;
      url?: string;
      thumbnailUrl?: string | null;
      isActive?: boolean;
      order?: number;
    } = {};

    if (typeof data.title === "string") updateData.title = data.title;
    if (typeof data.url === "string") updateData.url = data.url;
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
    if (typeof data.isActive === "boolean") updateData.isActive = data.isActive;
    if (typeof data.order === "number") updateData.order = data.order;

    const video = await prisma.$transaction(async (tx) => {
      const updatedVideo =
        Object.keys(updateData).length > 0
          ? await tx.video.update({
              where: { id: data.id },
              data: updateData,
            })
          : await tx.video.findUnique({ where: { id: data.id } });

      if (!updatedVideo) {
        throw new Error("Video not found");
      }

      if (data.isTutorial === true) {
        await tx.setting.upsert({
          where: { key: TUTORIAL_VIDEO_SETTING_KEY },
          update: { value: data.id },
          create: {
            key: TUTORIAL_VIDEO_SETTING_KEY,
            value: data.id,
          },
        });
      }

      if (data.isTutorial === false) {
        await tx.setting.deleteMany({
          where: {
            key: TUTORIAL_VIDEO_SETTING_KEY,
            value: data.id,
          },
        });
      }

      return updatedVideo;
    });

    const isTutorial = data.isTutorial === true;
    await triggerAdminRevalidate(request, {
      tags: ["content:home", "content:videos", "settings:tutorial-video"],
      paths: ["/"],
    });

    return NextResponse.json({ video: { ...video, isTutorial } });
  } catch (_error) {
    console.error("Video update error:", _error);
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

    await prisma.$transaction(async (tx) => {
      await tx.video.delete({ where: { id } });
      await tx.setting.deleteMany({
        where: {
          key: TUTORIAL_VIDEO_SETTING_KEY,
          value: id,
        },
      });
    });

    await triggerAdminRevalidate(request, {
      tags: ["content:home", "content:videos", "settings:tutorial-video"],
      paths: ["/"],
    });

    return NextResponse.json({ success: true });
  } catch (_error) {
    console.error("Video delete error:", _error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
