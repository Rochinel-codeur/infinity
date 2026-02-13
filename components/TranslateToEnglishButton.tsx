"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface TranslateToEnglishButtonProps {
  className?: string;
  label?: string;
}

type Language = "fr" | "en";

const LANGUAGE_STORAGE_KEY = "ui_language";
const TRANSLATE_CONTAINER_ID = "google_translate_element";
const TRANSLATE_SCRIPT_ID = "google-translate-script";
const MAX_APPLY_ATTEMPTS = 40;
const APPLY_INTERVAL_MS = 200;
const TRANSLATE_NOISE_SELECTORS = [
  ".goog-te-banner-frame.skiptranslate",
  ".goog-te-banner-frame",
  ".goog-te-balloon-frame",
  ".goog-te-menu-frame",
  "iframe.skiptranslate",
  "#goog-gt-tt",
  ".goog-tooltip",
  ".goog-text-highlight",
  "[class^='VIpgJd-']",
  "[class*=' VIpgJd-']",
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => unknown;
      };
    };
  }
}

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "fr";
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return saved === "en" ? "en" : "fr";
}

function writeLanguageCookie(language: Language) {
  if (typeof document === "undefined") return;
  const cookieValue = language === "en" ? "/auto/en" : "/auto/fr";
  const hostname = window.location.hostname;

  document.cookie = `googtrans=${cookieValue};path=/;max-age=31536000`;
  if (hostname.includes(".") && hostname !== "localhost" && hostname !== "127.0.0.1") {
    document.cookie = `googtrans=${cookieValue};path=/;domain=.${hostname};max-age=31536000`;
  }
}

function syncDocumentLanguage(language: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = language;
}

function hideTranslateNoise() {
  if (typeof document === "undefined") return;
  for (const selector of TRANSLATE_NOISE_SELECTORS) {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      element.style.display = "none";
      element.style.visibility = "hidden";
    });
  }
  document.body.style.top = "0px";
}

function applyLanguageToGoogle(language: Language) {
  writeLanguageCookie(language);
  syncDocumentLanguage(language);
  hideTranslateNoise();

  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (combo) {
    combo.value = language === "en" ? "en" : "fr";
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  return false;
}

function ensureTranslateContainer() {
  if (document.getElementById(TRANSLATE_CONTAINER_ID)) return;
  const container = document.createElement("div");
  container.id = TRANSLATE_CONTAINER_ID;
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.setAttribute("aria-hidden", "true");
  document.body.appendChild(container);
}

function initGoogleTranslate() {
  if (typeof window === "undefined") return;
  ensureTranslateContainer();
  const container = document.getElementById(TRANSLATE_CONTAINER_ID);
  if (container && container.childNodes.length > 0) return;

  if (window.google?.translate?.TranslateElement) {
    new window.google.translate.TranslateElement(
      { pageLanguage: "fr", includedLanguages: "fr,en", autoDisplay: false },
      TRANSLATE_CONTAINER_ID
    );
    return;
  }

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    new window.google.translate.TranslateElement(
      { pageLanguage: "fr", includedLanguages: "fr,en", autoDisplay: false },
      TRANSLATE_CONTAINER_ID
    );
  };

  if (document.getElementById(TRANSLATE_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = TRANSLATE_SCRIPT_ID;
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);
}

export function TranslateToEnglishButton({
  className = "",
  label,
}: TranslateToEnglishButtonProps) {
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>("fr");
  const [hydrated, setHydrated] = useState(false);
  const applyTimeoutRef = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const buttonLabel = useMemo(() => label ?? "FR | EN", [label]);

  const clearPendingApply = () => {
    if (applyTimeoutRef.current !== null) {
      window.clearTimeout(applyTimeoutRef.current);
      applyTimeoutRef.current = null;
    }
  };

  const applyLanguageWithRetry = (targetLanguage: Language, attempt = 0) => {
    if (applyLanguageToGoogle(targetLanguage)) return;
    if (attempt >= MAX_APPLY_ATTEMPTS) return;

    applyTimeoutRef.current = window.setTimeout(() => {
      applyLanguageWithRetry(targetLanguage, attempt + 1);
    }, APPLY_INTERVAL_MS);
  };

  useEffect(() => {
    const savedLanguage = readStoredLanguage();
    setLanguage(savedLanguage);
    setHydrated(true);
    initGoogleTranslate();
    clearPendingApply();
    applyLanguageWithRetry(savedLanguage);
    hideTranslateNoise();

    observerRef.current = new MutationObserver(() => {
      hideTranslateNoise();
    });
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearPendingApply();
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    initGoogleTranslate();
    clearPendingApply();
    applyLanguageWithRetry(language);
    hideTranslateNoise();
    return () => clearPendingApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, language, pathname]);

  const handleTranslate = () => {
    const nextLanguage: Language = language === "fr" ? "en" : "fr";
    setLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      className={`notranslate ${className}`.trim()}
      translate="no"
      title={language === "fr" ? "Traduire en anglais" : "Translate to French"}
      aria-label={language === "fr" ? "Traduire en anglais" : "Translate to French"}
    >
      <span className="inline-flex items-center gap-1.5 font-semibold" translate="no">
        <span
          className={`notranslate ${language === "fr" ? "text-blue-300" : "opacity-70"}`}
          translate="no"
        >
          FR
        </span>
        <span className="opacity-60" translate="no">
          |
        </span>
        <span
          className={`notranslate ${language === "en" ? "text-blue-300" : "opacity-70"}`}
          translate="no"
        >
          EN
        </span>
      </span>
      <span className="sr-only">{buttonLabel}</span>
    </button>
  );
}
