import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { getGuideBySlug, guides } from "../../data/guides";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Gids niet gevonden | Buitendrogen.be" };
  }

  return {
    title: `${guide.title} | Buitendrogen.be`,
    description: guide.description,
    keywords: [
      guide.keyword,
      "buiten drogen",
      "droogtijd calculator",
      "wasweer belgie",
      "was buiten hangen",
    ],
    alternates: {
      canonical: `https://buitendrogen.be/gids/${guide.slug}`,
    },
    openGraph: {
      title: `${guide.title} | Buitendrogen.be`,
      description: guide.description,
      type: "article",
      locale: "nl_BE",
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedGuides = guides.filter((item) => item.slug !== guide.slug).slice(0, 3);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-sky-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/gids" className="hover:text-sky-600">
              Gidsen
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{guide.title}</span>
          </nav>

          <article className="rounded-2xl bg-white shadow p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{guide.title}</h1>
            <p className="mt-3 text-gray-700">{guide.description}</p>

            <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
              {guide.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 space-y-8">
              {guide.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">{section.heading}</h2>
                  <div className="space-y-3 text-gray-700 leading-relaxed">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-4 list-disc pl-5 space-y-1 text-gray-700">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <section className="mt-8 rounded-xl bg-sky-50 border border-sky-100 p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Veelgestelde vragen</h2>
              <div className="space-y-3">
                {guide.faq.map((item) => (
                  <details key={item.question} className="rounded-lg border border-sky-200 bg-white p-3">
                    <summary className="cursor-pointer font-medium text-gray-900">{item.question}</summary>
                    <p className="mt-2 text-sm text-gray-700">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Lokale check voor jouw gemeente
              </h2>
              <p className="text-gray-700 mb-4">
                Gebruik de lokale droogtijd voor je eigen regio. Onderstaande links openen direct
                de gemeentepagina met actuele omstandigheden.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {guide.relatedGemeentes.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="rounded-xl bg-white border border-gray-200 p-3 text-sm hover:border-sky-300 hover:bg-sky-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{city.name}</span>
                  </Link>
                ))}
              </div>
            </section>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-block px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors"
              >
                Start calculator
              </Link>
              <Link
                href="/gids"
                className="inline-block px-5 py-2.5 bg-white text-sky-700 border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors"
              >
                Bekijk alle gidsen
              </Link>
            </div>
          </article>

          {relatedGuides.length > 0 && (
            <section className="mt-6 rounded-2xl bg-white shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gerelateerde gidsen</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {relatedGuides.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/gids/${item.slug}`}
                    className="rounded-xl border border-gray-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-xs text-gray-600">{item.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
