"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      // Register SW
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          // Check subscription status
          registration.pushManager.getSubscription().then(function (subscription) {
            if (subscription) {
              setIsSubscribed(true);
            } else {
              // Ask after a delay if not subscribed
               setTimeout(() => {
                   setShowPrompt(true);
               }, 5000);
            }
          });
        },
        function (error) {
          console.error("Service Worker registration failed:", error);
        }
      );
    }
  }, []);

  const subscribeUser = async () => {
    if (!("serviceWorker" in navigator)) return;
    setShowPrompt(false);

    try {
      const registration = await navigator.serviceWorker.ready;
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
          alert("Erreur de configuration : Clé VAPID manquante. Contactez l'admin.");
          return;
      }
      
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      setIsSubscribed(true);
      alert("Notifications activees. Vous recevrez nos mises a jour importantes.");
    } catch (error) {
      console.error("Failed to subscribe the user: ", error);
      alert("Impossible d'activer. Vérifiez si vous êtes en navigation privée ou si vous avez bloqué les notifications.");
    }
  };

  if (!showPrompt || isSubscribed) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-auto sm:right-4 z-[9999] flex justify-center sm:justify-end animate-bounce-in">
        <div className="bg-zinc-900 border border-indigo-500/50 p-3.5 sm:p-4 rounded-xl shadow-2xl max-w-[min(94vw,24rem)] w-full sm:w-auto flex items-start gap-3 sm:gap-4 backdrop-blur-md cursor-default text-left">
            <div className="bg-indigo-600/20 p-2 rounded-full text-indigo-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
            <div className="flex-1 relative">
                <button
                    type="button"
                    onClick={() => setShowPrompt(false)}
                    className="absolute -top-1 -right-1 text-zinc-500 hover:text-white text-xs rounded-full p-1"
                    aria-label="Fermer"
                >
                    ✕
                </button>
                <h4 className="font-bold text-white text-sm">Restez informe</h4>
                <p className="text-zinc-400 text-xs mt-1 break-words">
                    Activez les notifications pour recevoir les mises a jour et rappels utiles, au bon moment.
                </p>
                <div className="flex gap-2 sm:gap-3 mt-3">
                    <button 
                        onClick={subscribeUser}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                        Activer
                    </button>
                    <button 
                        onClick={() => setShowPrompt(false)}
                        className="text-zinc-500 hover:text-white text-xs px-2 py-1.5"
                    >
                        Plus tard
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
