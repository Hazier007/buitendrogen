// Phase B template — drop-in /privacybeleid page for the 13 Next.js portfolio sites.
// Tokens (replace literally per site, no string templates inside JSX so Next.js can statically analyse):
//   Buitendrogen.be            e.g. Btw-calculator.be
//   buitendrogen.be          e.g. btw-calculator.be
//   droogtijden wasgoed buiten berekenen     e.g. BTW bedragen berekenen
// Style: stock Tailwind prose, no per-site imports (Breadcrumbs/SITE_NAME etc are NOT imported here
//        because that would couple to per-site lib paths). Adjust per-site if you want it to match
//        existing /privacy styling.
//
// Source of truth for content: CAL-22_01_privacy_policy_template.md
// Entity: Hazier, KBO 0672.948.386, Blijde-Inkomststraat 16 9000 Gent, info@hazier.be (per CAL-22)

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacybeleid — Buitendrogen.be',
  description: 'Hoe Hazier persoonsgegevens verwerkt op Buitendrogen.be. AVG/GDPR-conform, met verwerkingsverantwoordelijke, doeleinden, cookies en uw rechten.',
  alternates: { canonical: 'https://buitendrogen.be/privacybeleid' },
  robots: { index: false, follow: true },
};

export default function PrivacybeleidPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Privacybeleid</h1>
      <p className="mt-2 text-sm text-gray-500">Laatst bijgewerkt: 25 april 2026</p>

      <div className="prose prose-gray mt-6 max-w-none">
        <p>
          Dit privacybeleid beschrijft hoe persoonsgegevens worden verwerkt wanneer u
          Buitendrogen.be (droogtijden wasgoed buiten berekenen) bezoekt of gebruikt. Wij nemen uw privacy
          serieus en verwerken uw gegevens uitsluitend conform de Algemene Verordening
          Gegevensbescherming (AVG / GDPR) en de Belgische Wet van 30 juli 2018.
        </p>

        <h2>1. Verwerkingsverantwoordelijke</h2>
        <p>Verantwoordelijke voor de verwerking van uw persoonsgegevens is:</p>
        <p>
          <strong>Hazier</strong>
          <br />Blijde-Inkomststraat 16, 9000 Gent
          <br />Ondernemingsnummer: 0672.948.386
          <br />Contact: <a href="mailto:info@hazier.be">info@hazier.be</a>
        </p>

        <h2>2. Welke gegevens verzamelen we?</h2>
        <ul>
          <li><strong>Technische loggegevens:</strong> IP-adres, browser, besturingssysteem, tijdstip van bezoek, bezochte pagina. Automatisch verzameld voor beveiliging en foutopsporing.</li>
          <li><strong>Gebruiksstatistieken (Google Analytics 4):</strong> anonieme paginaweergaven, sessieduur, verkeersbron. Geaggregeerd en geanonimiseerd.</li>
          <li><strong>Advertentiegegevens (Google AdSense):</strong> cookies en device-identifiers voor het tonen van advertenties, uitsluitend na uw toestemming via de cookiebanner.</li>
          <li><strong>Formulierinvoer:</strong> getallen die u invoert in onze rekentools worden uitsluitend in uw browser verwerkt en niet naar onze servers verzonden.</li>
        </ul>
        <p>
          Wij verzamelen <strong>geen</strong> namen, telefoonnummers of betaalgegevens.
          Buitendrogen.be vereist geen registratie of account.
        </p>

        <h2>3. Doeleinden en rechtsgrond</h2>
        <ul>
          <li>Weergave van de rekentool — Uitvoering dienst (AVG art. 6(1)(b))</li>
          <li>Beveiliging en foutopsporing (logs) — Gerechtvaardigd belang (AVG art. 6(1)(f))</li>
          <li>Statistieken (GA4, geanonimiseerd) — Toestemming (AVG art. 6(1)(a))</li>
          <li>Gepersonaliseerde advertenties — Toestemming (AVG art. 6(1)(a))</li>
          <li>Niet-gepersonaliseerde advertenties — Gerechtvaardigd belang (AVG art. 6(1)(f))</li>
        </ul>
        <p>
          U kunt uw toestemming op elk moment intrekken via het instellingenvenster van
          onze cookiebanner.
        </p>

        <h2>4. Cookies en Consent Mode v2</h2>
        <p>
          Buitendrogen.be gebruikt Google Consent Mode v2. Wanneer u onze site voor het eerst
          bezoekt staan advertentie- en analytics-cookies standaard op <strong>geweigerd</strong>.
          Pas nadat u via onze cookiebanner toestemming geeft worden deze cookies geplaatst.
        </p>

        <h2>5. Ontvangers van uw gegevens</h2>
        <p>
          Wij delen uw gegevens alleen met verwerkers die contractueel gebonden zijn aan
          AVG-verplichtingen:
        </p>
        <ul>
          <li><strong>Google Ireland Ltd.</strong> (AdSense, Funding Choices, GA4) — Gordon House, Barrow Street, Dublin 4, Ierland.</li>
          <li><strong>Hostingprovider</strong> — voor opslag en serving van buitendrogen.be.</li>
        </ul>
        <p>Wij verkopen uw gegevens <strong>nooit</strong> aan derden.</p>

        <h2>6. Internationale doorgifte</h2>
        <p>
          Enkele ontvangers (Google) kunnen gegevens verwerken buiten de EER, met name in
          de Verenigde Staten. Deze doorgiften vinden plaats onder het{' '}
          <strong>EU-US Data Privacy Framework</strong> (adequaatheidsbesluit van 10 juli 2023)
          en aanvullende Standard Contractual Clauses, conform art. 45–46 AVG.
        </p>

        <h2>7. Bewaartermijnen</h2>
        <ul>
          <li>Technische logs: maximaal 30 dagen, daarna automatisch verwijderd.</li>
          <li>Analytics-data: tot 14 maanden (GA4-standaard).</li>
          <li>Cookie-consent: 13 maanden (conform GBA-richtlijn), daarna opnieuw gevraagd.</li>
        </ul>

        <h2>8. Uw rechten</h2>
        <p>Onder de AVG heeft u de volgende rechten:</p>
        <ul>
          <li><strong>Inzage</strong> — een kopie van de gegevens die wij van u verwerken (art. 15).</li>
          <li><strong>Rectificatie</strong> — correctie van onjuiste gegevens (art. 16).</li>
          <li><strong>Wissing</strong> ("recht om vergeten te worden") (art. 17).</li>
          <li><strong>Beperking</strong> van de verwerking (art. 18).</li>
          <li><strong>Gegevensoverdraagbaarheid</strong> (art. 20).</li>
          <li><strong>Bezwaar</strong> tegen verwerking op basis van gerechtvaardigd belang (art. 21).</li>
          <li><strong>Intrekken van toestemming</strong> — op elk moment, zonder opgaaf van reden.</li>
        </ul>
        <p>
          Een verzoek kunt u sturen naar{' '}
          <a href="mailto:info@hazier.be">info@hazier.be</a>. Wij antwoorden binnen 30
          kalenderdagen.
        </p>
        <p>
          U heeft ook het recht klacht in te dienen bij de{' '}
          <strong>Gegevensbeschermingsautoriteit</strong>:
        </p>
        <p>
          Drukpersstraat 35, 1000 Brussel
          <br /><a href="mailto:contact@apd-gba.be">contact@apd-gba.be</a>
          <br /><a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer">gegevensbeschermingsautoriteit.be</a>
        </p>

        <h2>9. Wijzigingen</h2>
        <p>
          Dit beleid kan wijzigen, bijvoorbeeld bij nieuwe functionaliteit of gewijzigde
          regelgeving. De laatste versie vindt u steeds op{' '}
          <code>https://buitendrogen.be/privacybeleid</code>. Bij substantiële wijzigingen
          wordt de datum bovenaan dit document aangepast.
        </p>

        <h2>10. Contact</h2>
        <p>
          Vragen of verzoeken? Mail ons op{' '}
          <a href="mailto:info@hazier.be">info@hazier.be</a>.
        </p>
      </div>
    </main>
  );
}
