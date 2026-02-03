import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Over | Buitendrogen.be',
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Over - Buitendrogen.be</h1>
      <p className="mt-2 text-sm text-gray-500">Laatst bijgewerkt: 2026-02-02</p>

      <div className="prose prose-gray mt-6 max-w-none">
        <p>Buitendrogen.be (buitendrogen.be) is een informatieve website met tools en uitleg die je snel helpen met praktische berekeningen en checks. We proberen alles zo duidelijk mogelijk te maken en verbeteren de site op basis van gebruik en feedback.</p>
<p>Contact: <a href="mailto:info@hazier.be">info@hazier.be</a>.</p>
      </div>
    </main>
  );
}
