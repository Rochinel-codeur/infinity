"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { subscribeLiveSync } from "@/lib/liveSync";

export function PublicLiveSync() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeLiveSync((topic) => {
      if (topic.startsWith("content:") || topic.startsWith("settings:")) {
        router.refresh();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  return null;
}
