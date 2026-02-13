interface HomeTestimonial {
  id: string;
  name: string;
  text: string;
  date: string;
  rating?: number;
  source?: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface HomeVideo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface HomeScreenshot {
  id: string;
  name: string;
  message: string;
  amount: string;
  time: string;
  showName?: boolean;
  showMessage?: boolean;
  showAmount?: boolean;
  showTime?: boolean;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface HomeContentResponse {
  testimonials: HomeTestimonial[];
  videos: HomeVideo[];
  screenshots: HomeScreenshot[];
  promoCode: string;
  tutorialVideoId: string | null;
  memberAvatars: string[];
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export async function getHomeContent(): Promise<HomeContentResponse> {
  try {
    const response = await fetch(`${getSiteUrl()}/api/public/home`, {
      next: {
        tags: [
          "content:home",
          "content:testimonials",
          "content:videos",
          "content:screenshots",
          "settings:promo",
          "settings:tutorial-video",
          "settings:member-avatars",
        ],
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch home content");
    }

    return response.json();
  } catch (error) {
    console.error("Home content fetch failed:", error);
    return {
      testimonials: [],
      videos: [],
      screenshots: [],
      promoCode: "BCC123",
      tutorialVideoId: null,
      memberAvatars: [],
    };
  }
}
