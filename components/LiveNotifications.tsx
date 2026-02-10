"use client";

import { useEffect, useState } from "react";

const NAMES = ["Jean K.", "Paul M.", "Sarah L.", "David B.", "Eric T.", "Sophie A."];
const ACTIONS = ["vient de gagner 50.000 XAF", "a rejoint la méthode", "a validé son coupon", "a retiré 120.000 XAF"];
const CITIES = ["Douala", "Yaoundé", "Abidjan", "Dakar", "Libreville", "Paris"];

export function LiveNotifications() {
  const [notification, setNotification] = useState<{ name: string; action: string; city: string; time: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimeout = setTimeout(() => {
        showRandomNotification();
    }, 5000);

    // Loop notifications every 15-30 seconds
    const interval = setInterval(() => {
        showRandomNotification();
    }, 20000);

    return () => {
        clearTimeout(initialTimeout);
        clearInterval(interval);
    };
  }, []);

  const showRandomNotification = () => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    
    setNotification({ name, action, city, time: "À l'instant" });
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
        setIsVisible(false);
    }, 5000);
  };

  if (!notification) return null;

  return (
    <div 
        className={`fixed bottom-24 left-4 z-40 transition-all duration-500 ease-in-out transform ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
    >
        <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 p-3 pr-6 rounded-full shadow-2xl shadow-black/50">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 overflow-hidden relative border-2 border-zinc-800">
               <img 
                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.name}`} 
                 alt={notification.name} 
                 className="w-full h-full object-cover"
               />
            </div>
            <div>
                <p className="text-xs font-bold text-white">
                    {notification.name} <span className="font-normal text-zinc-400">de {notification.city}</span>
                </p>
                <p className="text-xs text-blue-400 font-medium">
                    {notification.action}
                </p>
            </div>
        </div>
    </div>
  );
}
