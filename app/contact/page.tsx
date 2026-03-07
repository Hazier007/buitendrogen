import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Buitendrogen.be',
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Contact - Buitendrogen.be</h1>
      <p className="mt-2 text-sm text-gray-500">Laatst bijgewerkt: 2026-02-02</p>

      <div className="prose prose-gray mt-6 max-w-none">
        <p>Vragen, feedback of een foutje gevonden? Mail ons op <a href="mailto:info@hazier.be">info@hazier.be</a>.</p>
      </div>
    </main>
  );
}
