"use client";

interface WhatsAppScreenshotProps {
  name?: string;
  message?: string;
  time?: string;
  amount?: string;
  imageUrl?: string | null;
  type?: "win" | "thanks" | "generic";
  showName?: boolean;
  showMessage?: boolean;
  showAmount?: boolean;
  showTime?: boolean;
  className?: string;
}

export function WhatsAppScreenshot({
  name = "Membre 1xBet",
  message = "Execution Apple of Fortune validee ✅",
  time = "10:30",
  amount = "500,000 XAF",
  imageUrl = null,
  showName = true,
  showMessage = true,
  showAmount = true,
  showTime = true,
  className = "",
}: WhatsAppScreenshotProps) {
  const hasImage = Boolean(imageUrl);
  const showOnlyCapture = hasImage && !showName && !showMessage && !showAmount && !showTime;
  const cardClassName = `w-[min(76vw,280px)] h-[min(104vw,380px)] bg-[#0b141a] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/50 flex flex-col ${className}`;

  if (showOnlyCapture) {
    return (
      <div className={cardClassName}>
        <div className="p-2 h-full">
          <img src={imageUrl as string} alt="Capture de preuve" className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      <div className="bg-[#1f2c34] px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3 border-b border-[#2a373f] relative z-10">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {(showName ? name : "Capture").charAt(0)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-[13px] sm:text-sm font-semibold leading-none truncate">
            {showName ? name : "Capture verifiee"}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">Apple of Fortune | 1xBet</p>
        </div>
      </div>

      <div className="bg-[#0b141a] p-3 sm:p-4 flex-1 min-h-0 flex flex-col justify-end space-y-2.5 sm:space-y-3 relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_45%)] pointer-events-none" />

        {!showOnlyCapture && showMessage && (
          <div className="self-start bg-[#1f2c34] text-white/90 p-2.5 rounded-lg rounded-tl-none max-w-[85%] text-xs shadow-sm relative z-10">
            <p>{message}</p>
          </div>
        )}

        <div className={`bg-[#1f2c34] p-1 rounded-lg max-w-[90%] shadow-sm relative z-10 ${showOnlyCapture ? "self-center" : "self-start"}`}>
          {hasImage ? (
            <div className="relative overflow-hidden rounded">
              <img src={imageUrl as string} alt="Capture de preuve" className="w-full h-[150px] sm:h-[170px] object-cover rounded" />
            </div>
          ) : (
            <div className="bg-[#111b21] border border-white/10 p-3 rounded text-white text-[10px] w-52 relative overflow-hidden">
              <div className="border-b border-dashed border-white/20 pb-2 mb-2">
                <h4 className="font-bold text-center text-xs">PREUVE EN ATTENTE</h4>
              </div>
              <div className="space-y-1 text-white/80">
                <div className="flex justify-between"><span>Jeu</span> <span>Apple of Fortune</span></div>
                <div className="flex justify-between"><span>Plateforme</span> <span>1xBet</span></div>
                <div className="flex justify-between"><span>Etat</span> <span>En cours</span></div>
              </div>
            </div>
          )}
        </div>

        {!showOnlyCapture && (showAmount || showTime) && (
          <div className="self-end bg-[#005c4b] text-white p-2.5 rounded-lg rounded-tr-none max-w-[85%] text-xs shadow-sm relative z-10">
            {showAmount && <p className="font-bold">Resultat: {amount}</p>}
            {showTime && <p className="text-[10px] text-white/80 mt-1">{time}</p>}
          </div>
        )}
      </div>

      <div className="bg-[#1f2c34] p-2 flex items-center gap-2 relative z-10">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2a373f] flex items-center justify-center text-zinc-400">
          <span className="text-sm">+</span>
        </div>
        <div className="flex-1 bg-[#2a373f] h-8 rounded-full px-3 flex items-center">
          <span className="text-zinc-500 text-[10px]">Compte rendu...</span>
        </div>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00a884] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2ZM11 16V8H13V16H11Z" transform="rotate(90 12 12)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
