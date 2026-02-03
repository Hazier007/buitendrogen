'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

type Consent = { analytics: boolean; marketing: boolean; ts: number };

function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem('cookieConsent');
    if (!raw) return null;
    return JSON.parse(raw) as Consent;
  } catch {
    return null;
  }
}

export default function Analytics({ gaId }: { gaId: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const c = getConsent();
    setEnabled(!!c?.analytics);

    const onChanged = () => {
      const next = getConsent();
      setEnabled(!!next?.analytics);
    };

    window.addEventListener('cookie-consent-changed', onChanged);
    return () => window.removeEventListener('cookie-consent-changed', onChanged);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
