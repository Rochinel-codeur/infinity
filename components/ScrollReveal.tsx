"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  className = "",
  direction = "up" 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  const transforms = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    scale: "scale-95",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? "opacity-100 translate-y-0 translate-x-0 scale-100" 
          : `opacity-0 ${transforms[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
