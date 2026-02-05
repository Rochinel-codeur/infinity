"use client";
import { useEffect, useState } from "react";

interface Notification {
  id: string;
  message: string;
  level: "info" | "warning" | "success" | "urgent";
}

export function FloatingNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/notifications/active")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            setNotifications(data);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const visibleNotifications = notifications.filter(n => !dismissedIds.includes(n.id));

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-4 max-w-xs sm:max-w-sm w-full pointer-events-none">
       {visibleNotifications.map(n => (
          <div key={n.id} className="pointer-events-auto bg-zinc-900/95 backdrop-blur-md border border-blue-500/50 p-4 rounded-2xl shadow-xl animate-bounce-in relative overflow-hidden group">
             {/* Glow */}
             <div className={`absolute top-0 left-0 w-1.5 h-full ${n.level === 'urgent' ? 'bg-red-500' : 'bg-blue-500'}`} />
             
             <button 
                onClick={() => handleDismiss(n.id)}
                className="absolute top-2 right-2 text-zinc-500 hover:text-white p-1 bg-black/20 rounded-full hover:bg-black/50 transition-colors"
             >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
             </button>

             <div className="flex gap-3 pr-6">
                <div className="mt-1 flex-shrink-0">
                    {n.level === 'urgent' && <span className="text-2xl animate-pulse">🚨</span>}
                    {n.level === 'success' && <span className="text-2xl">🎉</span>}
                    {n.level === 'info' && <span className="text-2xl">📢</span>}
                    {n.level === 'warning' && <span className="text-2xl">⚠️</span>}
                </div>
                <div>
                    <p className="text-white font-semibold text-sm leading-relaxed tracking-wide font-sans">
                        {n.message}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Message Admin</p>
                </div>
             </div>
          </div>
       ))}
    </div>
  );
}
