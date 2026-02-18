import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookiebeleid | Buitendrogen.be',
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Cookiebeleid - Buitendrogen.be</h1>
      <p className="mt-2 text-sm text-gray-500">Laatst bijgewerkt: 2026-02-02</p>

      <div className="prose prose-gray mt-6 max-w-none">
        <p>Buitendrogen.be gebruikt cookies en gelijkaardige technologieën om de website goed te laten werken, statistieken te verzamelen en (optioneel) advertenties te tonen.</p>
<h2>1. Wat zijn cookies?</h2>
<p>Cookies zijn kleine tekstbestanden die op je toestel worden opgeslagen.</p>
<h2>2. Welke soorten cookies gebruiken we?</h2>
<ul>
  <li><strong>Noodzakelijke cookies:</strong> nodig voor basiswerking en beveiliging.</li>
  <li><strong>Statistiekcookies:</strong> helpen ons begrijpen hoe de site gebruikt wordt (bv. GA4), afhankelijk van je toestemming.</li>
  <li><strong>Marketingcookies:</strong> gebruikt voor advertenties/meting (bv. Google AdSense), afhankelijk van je toestemming.</li>
</ul>
<h2>3. Cookie-instellingen</h2>
<p>Je kan je toestemming op elk moment aanpassen via â€œCookie-instellingenâ€ in de footer, of via je browserinstellingen.</p>
      </div>
    </main>
  );
}
