import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | Buitendrogen.be',
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Disclaimer - Buitendrogen.be</h1>
      <p className="mt-2 text-sm text-gray-500">Laatst bijgewerkt: 2026-02-02</p>

      <div className="prose prose-gray mt-6 max-w-none">
        <p>De informatie en tools op buitendrogen.be zijn bedoeld voor algemene informatiedoeleinden. We doen ons best om alles correct en up-to-date te houden, maar we geven geen garanties over volledigheid of juistheid.</p>
<p>Gebruik van calculators/tools gebeurt op eigen verantwoordelijkheid. Buitendrogen.be is niet aansprakelijk voor schade die voortvloeit uit het gebruik van de website of de resultaten.</p>
<p>Externe links vallen buiten onze controle.</p>
<p>Vragen: <a href="mailto:info@hazier.be">info@hazier.be</a>.</p>
      </div>
    </main>
  );
}
