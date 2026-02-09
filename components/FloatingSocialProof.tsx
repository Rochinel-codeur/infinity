"use client";
import { useEffect, useState } from "react";

const ACTIONS = [
  { text: "a gagné 150.000F", icon: "💰", color: "text-green-400" },
  { text: "s'est inscrit(e)", icon: "👋", color: "text-blue-400" },
  { text: "a copié le code", icon: "🎫", color: "text-purple-400" },
  { text: "a retiré ses gains", icon: "🏦", color: "text-yellow-400" },
  { text: "vient de commenter", icon: "💬", color: "text-pink-400" },
  { text: "est en ligne", icon: "🟢", color: "text-emerald-400" },
];

const NAMES = ["Paul", "Sarah", "Eric", "Julie", "Marc", "Sophie", "Jean", "Marie", "Lucas", "Léa", "Thomas", "Camille"];

interface Bubble {
  id: number;
  name: string;
  actionText: string;
  icon: string;
  color: string;
  style: React.CSSProperties;
  floatClass: string;
}

export function FloatingSocialProof() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate bubbles only on client to avoid hydration mismatch
    const newBubbles = Array.from({ length: 12 }).map((_, i) => {
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      
      return {
        id: i,
        name,
        actionText: action.text,
        icon: action.icon,
        color: action.color,
        style: {
          left: `${Math.random() * 90}%`,
          top: `${Math.random() * 90}%`,
          animationDelay: `${Math.random() * -20}s`, // Start at random point in cycle
          opacity: 0.6 + Math.random() * 0.4, // Random opacity
        },
        floatClass: `animate-float-${(i % 3) + 1}`,
      };
    });
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className={`absolute flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-black/80 hover:z-50 hover:opacity-100 ${b.floatClass}`}
          style={b.style}
        >
          <span className="text-sm">{b.icon}</span>
          <span className="text-xs font-medium text-white/90 whitespace-nowrap">
             <span className={`font-bold ${b.color}`}>{b.name}</span> {b.actionText}
          </span>
        </div>
      ))}
    </div>
  );
}
