import type { Metadata } from "next";
import Link from "next/link";

import Footer from "../components/Footer";
import Header from "../components/Header";
import { guides } from "../data/guides";

export const metadata: Metadata = {
  title: "Praktische gidsen voor buiten drogen | Buitendrogen.be",
  description:
    "Lees praktische gidsen over buiten drogen in Belgie: winterdroog, luchtvochtigheid, timing en realistische droogtijden.",
  keywords: [
    "buiten drogen gids",
    "was buiten drogen winter",
    "was buiten drogen luchtvochtigheid",
    "beste moment was buiten hangen",
    "droogtijd was buiten",
  ],
};

export default function GuidesIndexPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-sky-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Gidsen</span>
          </nav>

          <div className="rounded-2xl bg-white shadow p-6 md:p-8 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Praktische gidsen voor buiten drogen
            </h1>
            <p className="mt-3 text-gray-700 max-w-3xl">
              Deze gidsen beantwoorden de meest gezochte vragen rond buiten drogen in Belgie.
              Gebruik ze samen met de calculator voor een betere timing per gemeente.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/gids/${guide.slug}`}
                className="rounded-2xl bg-white shadow p-6 hover:shadow-md border border-transparent hover:border-sky-200 transition-all"
              >
                <h2 className="text-xl font-semibold text-gray-900">{guide.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{guide.description}</p>
                <div className="mt-3 text-sm text-sky-700 font-medium">Lees gids</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
