"use client";

import { useEffect, useRef } from "react";

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  
  const stored = sessionStorage.getItem("tracking_session_id");
  if (stored) return stored;
  
  const newId = generateSessionId();
  sessionStorage.setItem("tracking_session_id", newId);
  return newId;
}

export function useTracking() {
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    
    // Track page view on mount
    trackEvent("page_view");
  }, []);

  const trackEvent = async (
    type: "page_view" | "code_copy" | "download_click" | "signup_click",
    metadata?: Record<string, unknown>
  ) => {
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          sessionId: sessionIdRef.current,
          metadata,
        }),
      });
    } catch (error) {
      // Silently fail - tracking should not affect UX
      console.debug("Tracking error:", error);
    }
  };

  return { trackEvent };
}

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  useTracking();
  return <>{children}</>;
}
