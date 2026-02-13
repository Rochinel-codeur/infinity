function safeParseUrl(rawUrl: string): URL | null {
  try {
    return new URL(rawUrl);
  } catch {
    return null;
  }
}

function getYouTubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const path = url.pathname;

  if (host === "youtu.be") {
    const id = path.split("/").filter(Boolean)[0];
    return id || null;
  }

  if (host.endsWith("youtube.com")) {
    const fromQuery = url.searchParams.get("v");
    if (fromQuery) return fromQuery;

    const parts = path.split("/").filter(Boolean);
    if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") {
      return parts[1] || null;
    }
  }

  return null;
}

function getVimeoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (!host.endsWith("vimeo.com")) return null;
  const match = url.pathname.match(/\/(?:video\/)?(\d+)/);
  return match?.[1] || null;
}

function getTikTokId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (!host.includes("tiktok.com")) return null;
  const match = url.pathname.match(/\/video\/(\d+)/);
  return match?.[1] || null;
}

function getInstagramInfo(url: URL): { type: string; id: string } | null {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (!host.endsWith("instagram.com")) return null;
  const match = url.pathname.match(/\/(reel|p|tv)\/([a-zA-Z0-9_-]+)/);
  if (!match?.[1] || !match?.[2]) return null;
  return { type: match[1], id: match[2] };
}

function getDailymotionId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host === "dai.ly") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id || null;
  }
  if (host.endsWith("dailymotion.com")) {
    const match = url.pathname.match(/\/video\/([a-zA-Z0-9]+)/);
    return match?.[1] || null;
  }
  return null;
}

function isFacebookUrl(url: URL): boolean {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  return host.endsWith("facebook.com") || host.endsWith("fb.watch");
}

export function isDirectVideoSource(url: string): boolean {
  return (
    /(\.mp4|\.webm|\.ogg|\.mov|\.m4v)(\?|#|$)/i.test(url) ||
    url.startsWith("/uploads/videos/") ||
    url.startsWith("/media/")
  );
}

export function getPlatformEmbedUrl(rawUrl: string): string | null {
  const url = safeParseUrl(rawUrl);
  if (!url) return null;

  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1`;
  }

  const tiktokId = getTikTokId(url);
  if (tiktokId) {
    return `https://www.tiktok.com/embed/v2/${tiktokId}`;
  }

  const instagram = getInstagramInfo(url);
  if (instagram) {
    return `https://www.instagram.com/${instagram.type}/${instagram.id}/embed`;
  }

  const dailymotionId = getDailymotionId(url);
  if (dailymotionId) {
    return `https://www.dailymotion.com/embed/video/${dailymotionId}?autoplay=1&mute=1`;
  }

  if (isFacebookUrl(url)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(rawUrl)}&show_text=false&autoplay=true`;
  }

  return null;
}
