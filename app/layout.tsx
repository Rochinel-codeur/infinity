import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { TrackingProvider } from "@/components/TrackingProvider";

function getMetadataBase(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}

const metadataBase = getMetadataBase();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }
  ]
};

export const metadata: Metadata = {
  metadataBase,
  title: "Méthode Simple & Testée — Preuve Sociale Vérifiée",
  description:
    "Découvre une méthode simple déjà testée par +12 000 personnes. Vidéo explicative, retours utilisateurs vérifiés. Mobile-first, rapide, efficace.",
  keywords: ["méthode", "code promo", "inscription", "application", "tutoriel"],
  authors: [{ name: "Méthode Testée" }],
  creator: "Méthode Testée",
  publisher: "Méthode Testée",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Méthode Simple & Testée — +12 000 Utilisateurs",
    description:
      "Découvre une méthode simple déjà testée par +12 000 personnes. Vidéo explicative, retours utilisateurs vérifiés.",
    type: "website",
    locale: "fr_FR",
    siteName: "Méthode Testée",
    images: [
      {
        url: "/assets/poster.jpg",
        width: 1200,
        height: 630,
        alt: "Aperçu de la méthode - Témoignages vérifiés"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Méthode Simple & Testée — +12 000 Utilisateurs",
    description:
      "Découvre une méthode simple déjà testée par +12 000 personnes. Vidéo explicative, retours utilisateurs vérifiés.",
    images: ["/assets/poster.jpg"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white text-zinc-950 antialiased selection:bg-emerald-500/20 selection:text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 dark:selection:bg-emerald-400/30 dark:selection:text-zinc-50">
        <TrackingProvider>
          {children}
        </TrackingProvider>
      </body>
    </html>
  );
}
