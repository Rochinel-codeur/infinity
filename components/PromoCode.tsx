"use client";

import { useId, useMemo, useState } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PromoCode({ code }: { code: string }) {
  const id = useId();
  const inputId = useMemo(() => `promo-${id}`, [id]);
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!success) {
          throw new Error("copy_failed");
        }
      }
      setState("copied");
      window.setTimeout(() => setState("idle"), 1200);
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 1600);
    }
  }

  const feedback =
    state === "copied" ? "Copié" : state === "error" ? "Copie impossible" : "Copier";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft">
      <p className="text-xs font-medium text-zinc-200">Code promo</p>
      <div className="mt-2 flex items-stretch gap-2">
        <label htmlFor={inputId} className="sr-only">
          Code promo
        </label>
        <input
          id={inputId}
          readOnly
          value={code}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-semibold tracking-wider text-zinc-50 outline-none ring-0 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          aria-label="Code promo"
        />
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex min-w-[110px] items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold outline-none transition",
            "border border-white/10 bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/20",
            "focus-visible:ring-2 focus-visible:ring-emerald-400/60",
            state === "copied" && "bg-emerald-400/25 text-emerald-100",
            state === "error" && "bg-red-400/15 text-red-200"
          )}
          aria-label="Copier le code promo"
        >
          {feedback}
        </button>
      </div>
      <p className="mt-2 text-xs text-zinc-400" aria-live="polite">
        Utilise ce code lors de l’inscription.
      </p>
    </div>
  );
}
