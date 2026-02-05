"use client";

import { useEffect, useRef } from "react";

export function PageTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    
    // Simple deduplication for strict mode
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
        const key = `tracked_${window.location.pathname}_${new Date().getMinutes()}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
    }

    fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "page_view" })
    }).catch(err => console.error("Tracking error", err));
  }, []);

  return null;
}
