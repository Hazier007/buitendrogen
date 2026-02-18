'use client';

import { useEffect, useMemo, useState } from 'react';

type Consent = {
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

const STORAGE_KEY = 'cookieConsent';

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics !== 'boolean') return null;
    if (typeof parsed?.marketing !== 'boolean') return null;
    if (typeof parsed?.ts !== 'number') return null;
    return parsed as Consent;
  } catch {
    return null;
  }
}

function writeConsent(consent: Omit<Consent, 'ts'>) {
  const full: Consent = { ...consent, ts: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: full }));
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<Consent | null>(null);

  const hasConsent = useMemo(() => !!consent, [consent]);

  useEffect(() => {
    const existing = readConsent();
    setConsent(existing);
    setOpen(!existing);

    const onOpen = () => setOpen(true);
    const onReset = () => {
      localStorage.removeItem(STORAGE_KEY);
      setConsent(null);
      setOpen(true);
      window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: null }));
    };

    window.addEventListener('open-cookie-banner', onOpen);
    window.addEventListener('reset-cookie-consent', onReset);

    return () => {
      window.removeEventListener('open-cookie-banner', onOpen);
      window.removeEventListener('reset-cookie-consent', onReset);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="pr-0 sm:pr-6">
              <p className="font-semibold text-gray-900">Cookies</p>
              <p className="mt-1 text-sm text-gray-600">
                We gebruiken noodzakelijke cookies voor de werking van de site. Met jouw toestemming gebruiken we ook cookies voor statistieken
                (GA4) en advertenties (Google AdSense).
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Je kan dit later aanpassen via â€œCookie-instellingenâ€ in de footer.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-[220px]">
              <button
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                onClick={() => {
                  writeConsent({ analytics: true, marketing: true });
                  setConsent(readConsent());
                  setOpen(false);
                }}
              >
                Alles aanvaarden
              </button>
              <button
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                onClick={() => {
                  writeConsent({ analytics: false, marketing: false });
                  setConsent(readConsent());
                  setOpen(false);
                }}
              >
                Enkel noodzakelijk
              </button>
              {hasConsent && (
                <button
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                  onClick={() => setOpen(false)}
                >
                  Sluiten
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
