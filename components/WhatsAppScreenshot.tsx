"use client";

interface WhatsAppScreenshotProps {
  name?: string;
  message?: string;
  time?: string;
  amount?: string;
  imageUrl?: string | null;
  type?: "win" | "thanks" | "generic";
  className?: string;
}

export function WhatsAppScreenshot({
  name = "Coach Pronos",
  message = "Validation Confirmée ! ✅",
  time = "10:30",
  amount = "500,000 XAF",
  imageUrl = null,
  type = "win",
  className = ""
}: WhatsAppScreenshotProps) {
  return (
    <div className={`w-[280px] bg-[#0b141a] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/50 ${className}`}>
      {/* Header */}
      <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3 border-b border-[#2a373f] relative z-10">
         <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                 {name.charAt(0)}
             </div>
         </div>
         <div className="flex-1 min-w-0">
             <h3 className="text-white text-sm font-semibold leading-none truncate">{name}</h3>
             <p className="text-[10px] text-zinc-400 mt-0.5">En ligne</p>
         </div>
         <div className="flex gap-3 text-[#00a884]">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.9 14.3H15L14.7 19H13.7L14.1 16.9H12.6L12.9 14.3H12L12.3 9H13.4L13 11.2H14.5L14.1 14.3H15.9ZM22 13.9C22 15.3 21.7 16.6 21.1 17.7C20.5 18.8 19.6 19.7 18.5 20.4C17.4 21.1 16.1 21.4 14.7 21.4C13.3 21.4 12 21.1 10.9 20.4C9.8 19.7 8.9 18.8 8.3 17.7C7.7 16.6 7.4 15.3 7.4 13.9C7.4 12.5 7.7 11.3 8.3 10.2C8.9 9.1 9.8 8.2 10.9 7.5C12 6.8 13.3 6.5 14.7 6.5C16.1 6.5 17.4 6.8 18.5 7.5C19.6 8.2 20.5 9.1 21.1 10.2C21.7 11.3 22 12.5 22 13.9ZM11.7 4.9C11.1 4.5 10.5 4.3 9.7 4.3C8.7 4.3 7.7 4.8 6.9 5.8C6.1 6.8 5.7 8.2 5.7 10H4.2C4.2 7.7 4.9 5.8 6.1 4.5C7.3 3.2 8.9 2.5 10.9 2.5C12.1 2.5 13.2 2.8 14.1 3.3L13.3 4.9H11.7Z"/></svg>
         </div>
      </div>

      {/* Chat Area */}
      <div className="bg-[#0b141a] p-4 min-h-[250px] flex flex-col justify-end space-y-3 relative">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-5 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] pointer-events-none"></div>

         {/* Messages */}
         {type === "win" && (
             <>
                <div className="self-start bg-[#1f2c34] text-white/90 p-2.5 rounded-lg rounded-tl-none max-w-[85%] text-xs shadow-sm relative z-10">
                    <p>Voici le coupon du jour ! Grosse confiance 💎</p>
                    <span className="text-[9px] text-white/50 block text-right mt-1">10:15</span>
                </div>
                
                <div className="self-start bg-[#1f2c34] p-1 rounded-lg rounded-tl-none max-w-[85%] shadow-sm relative z-10">
                    {imageUrl ? (
                        <div className="relative overflow-hidden rounded">
                            <img src={imageUrl} alt="Preuve de gain" className="w-full h-auto max-h-48 object-cover rounded" />
                        </div>
                    ) : (
                        /* Fake Ticket Image Representation */
                        <div className="bg-white p-3 rounded text-black font-mono text-[10px] w-48 relative overflow-hidden">
                            <div className="border-b border-dashed border-black/20 pb-2 mb-2">
                                 <h4 className="font-bold text-center text-xs">TICKET #882910</h4>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between"><span>Dortmund - PSG</span> <span>1</span></div>
                                <div className="flex justify-between"><span>Real - City</span> <span>X</span></div>
                                <div className="flex justify-between font-bold pt-1"><span>Cote Totale</span> <span>45.2</span></div>
                            </div>
                            {/* Stamp */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-4 border-green-600 rounded-full opacity-30 -rotate-12 flex items-center justify-center">
                                <span className="text-green-600 font-bold text-lg">GAGNÉ</span>
                            </div>
                        </div>
                    )}
                    <span className="text-[9px] text-white/50 block text-right pr-2 pb-1 mt-1">10:15</span>
                </div>

                <div className="self-end bg-[#005c4b] text-white p-2.5 rounded-lg rounded-tr-none max-w-[85%] text-xs shadow-sm relative z-10">
                    <p>Woooow merci coach ! Validé ✅</p>
                    <p className="mt-1 font-bold">Encaissement : {amount}</p>
                    <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[9px] text-white/70">{time}</span>
                        <svg className="w-3 h-3 text-[#53bdeb]" viewBox="0 0 16 15" width="16" height="15"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/></svg>
                    </div>
                </div>
             </>
         )}

         {type === "thanks" && (
             <>
                 <div className="self-start bg-[#1f2c34] text-white/90 p-2.5 rounded-lg rounded-tl-none max-w-[85%] text-xs shadow-sm relative z-10">
                    <p>Code Promo activé ?</p>
                    <span className="text-[9px] text-white/50 block text-right mt-1">09:40</span>
                </div>
                 <div className="self-end bg-[#005c4b] text-white p-2.5 rounded-lg rounded-tr-none max-w-[85%] text-xs shadow-sm relative z-10">
                    <p>Oui j&apos;ai reçu le bonus de 200% direct ! Merci pour l&apos;info 🔥</p>
                    <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[9px] text-white/70">09:42</span>
                        <svg className="w-3 h-3 text-[#53bdeb]" viewBox="0 0 16 15" width="16" height="15"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/></svg>
                    </div>
                </div>
             </>
         )}

         {type === "generic" && (
             <div className="self-center bg-[#1f2c34/50] text-zinc-400 p-2 rounded-lg text-xs text-center">
                 {message}
             </div>
         )}
      </div>

      {/* Input Area */}
      <div className="bg-[#1f2c34] p-2 flex items-center gap-2 relative z-10">
         <div className="w-6 h-6 rounded-full bg-[#2a373f] flex items-center justify-center text-zinc-400">
             <span className="text-sm">+</span>
         </div>
         <div className="flex-1 bg-[#2a373f] h-8 rounded-full px-3 flex items-center">
             <span className="text-zinc-500 text-[10px]">Message...</span>
         </div>
         <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center">
             <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2ZM11 16V8H13V16H11Z" transform="rotate(90 12 12)"/></svg>
         </div>
      </div>
    </div>
  );
}
