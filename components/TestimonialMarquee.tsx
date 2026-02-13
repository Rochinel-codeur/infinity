"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WhatsAppScreenshot } from "@/components/WhatsAppScreenshot";

interface Screenshot {
  id: string;
  name: string;
  message: string;
  amount: string;
  time: string;
  type?: string;
  showName?: boolean;
  showMessage?: boolean;
  showAmount?: boolean;
  showTime?: boolean;
  imageUrl?: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  imageUrl?: string | null;
  text: string;
}

interface TestimonialMarqueeProps {
  testimonials?: Testimonial[];
  screenshots?: Screenshot[];
}

export function TestimonialMarquee({ testimonials = [], screenshots = [] }: TestimonialMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const interactionTimeoutRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [canPauseOnHover, setCanPauseOnHover] = useState(true);
  const useScreenshots = screenshots && screenshots.length > 0;

  const pauseAutoScrollTemporarily = useCallback((duration = 2800) => {
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current !== null) {
      window.clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = window.setTimeout(() => {
      setIsUserInteracting(false);
    }, duration);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const applyValue = () => setCanPauseOnHover(media.matches);
    applyValue();
    media.addEventListener("change", applyValue);
    return () => {
      media.removeEventListener("change", applyValue);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current !== null) {
        window.clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const displayItems = useMemo<(Screenshot | Testimonial)[]>(() => {
    if (useScreenshots) {
      return screenshots;
    }

    if (testimonials && testimonials.length > 0) {
      return testimonials;
    }

    return [
      { id: "d1", name: "Marc André", text: "Merci pour le gain", imageUrl: null },
      { id: "d2", name: "Sophie T.", text: "Validé !", imageUrl: null },
      { id: "d3", name: "Jean Luc", text: "Superbe", imageUrl: null },
      { id: "d4", name: "Fabrice", text: "Encore gagné", imageUrl: null },
    ];
  }, [useScreenshots, screenshots, testimonials]);

  const loopItems = useMemo(() => {
    if (displayItems.length === 0) return [];
    return [...displayItems, ...displayItems];
  }, [displayItems]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node || displayItems.length === 0) return;

    const speed = 0.6;
    let rafId = 0;

    const tick = () => {
      const shouldPause = (canPauseOnHover && isHovered) || isUserInteracting;
      if (!shouldPause) {
        node.scrollLeft += speed;

        const halfWidth = node.scrollWidth / 2;
        if (node.scrollLeft >= halfWidth) {
          node.scrollLeft -= halfWidth;
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [canPauseOnHover, displayItems.length, isHovered, isUserInteracting]);

  // Use native wheel listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const handleWheel = (event: WheelEvent) => {
      const horizontalDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (horizontalDelta !== 0) {
        event.preventDefault();
        node.scrollLeft += horizontalDelta;
        pauseAutoScrollTemporarily();
      }
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", handleWheel);
    };
  }, [pauseAutoScrollTemporarily]);

  const scrollByAmount = (direction: "left" | "right") => {
    const node = viewportRef.current;
    if (!node) return;
    pauseAutoScrollTemporarily();
    const step = Math.max(260, Math.floor(node.clientWidth * 0.7));
    node.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="w-full bg-black py-6 sm:py-8 relative group"
      onMouseEnter={() => {
        if (canPauseOnHover) {
          setIsHovered(true);
        }
        pauseAutoScrollTemporarily();
      }}
      onMouseLeave={() => {
        if (canPauseOnHover) setIsHovered(false);
      }}
    >
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 md:pl-4 z-20">
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          aria-label="Defiler a gauche"
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-white/20 bg-zinc-900/90 text-white hover:border-blue-400 hover:text-blue-300 transition-colors opacity-90 md:opacity-0 md:group-hover:opacity-100"
        >
          ←
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-4 z-20">
        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          aria-label="Defiler a droite"
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-white/20 bg-zinc-900/90 text-white hover:border-blue-400 hover:text-blue-300 transition-colors opacity-90 md:opacity-0 md:group-hover:opacity-100"
        >
          →
        </button>
      </div>

      <div
        ref={viewportRef}
        className="overflow-x-auto overflow-y-hidden px-10 sm:px-12 md:px-16 pb-2 [scrollbar-width:thin] [scrollbar-color:#3f3f46_#09090b]"
        onTouchStart={() => pauseAutoScrollTemporarily(3200)}
        onTouchMove={() => pauseAutoScrollTemporarily(3200)}
        onPointerDown={() => pauseAutoScrollTemporarily(3200)}
      >
        <div className="flex w-max gap-4 sm:gap-5">
          {loopItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 transform transition-transform hover:scale-[1.02] duration-300"
            >
              <WhatsAppScreenshot
                name={item.name}
                message={useScreenshots && 'message' in item ? item.message : ('text' in item ? item.text : '')}
                imageUrl={item.imageUrl}
                type={(useScreenshots && 'type' in item && item.type ? item.type : index % 2 === 0 ? "win" : "thanks") as "win" | "thanks" | "generic"}
                amount={useScreenshots && 'amount' in item ? item.amount : `${((index * 7 + 10) % 50 + 10) * 10000} XAF`}
                time={useScreenshots && 'time' in item ? item.time : `${10 + (index % 12)}:${((index * 5) % 60).toString().padStart(2, "0")}`}
                showName={useScreenshots ? false : true}
                showMessage={useScreenshots && 'showMessage' in item ? item.showMessage : true}
                showAmount={useScreenshots && 'showAmount' in item ? item.showAmount : true}
                showTime={useScreenshots && 'showTime' in item ? item.showTime : true}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}
