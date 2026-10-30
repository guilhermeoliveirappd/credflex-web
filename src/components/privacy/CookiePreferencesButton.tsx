"use client";

import { openCookiePreferences } from "@/lib/privacy/consent";

export function CookiePreferencesButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      Preferências de cookies
    </button>
  );
}
