import Link from "next/link";

const tools = [
  { name: "BTW Calculator", url: "https://btw-calculator.be" },
  { name: "IBAN Validator", url: "https://ibanvalidator.be" },
  { name: "Huurrendement Calculator", url: "https://huurrendementcalculator.be" },
  { name: "KM Vergoeding", url: "https://kmvergoeding.be" },
  { name: "Datum Berekenen", url: "https://datumberekenen.be" },
  { name: "Zwangerschapscalculator", url: "https://zwangerschapscalculator.be" },
  { name: "Kleurcodes", url: "https://kleurcodes.be" },
  { name: "Goedkoop Stroom", url: "https://goedkoopstroom.be" },
];

const popularCities = [
  { name: "Antwerpen", slug: "antwerpen" },
  { name: "Gent", slug: "gent" },
  { name: "Brugge", slug: "brugge" },
  { name: "Leuven", slug: "leuven" },
  { name: "Mechelen", slug: "mechelen" },
  { name: "Hasselt", slug: "hasselt" },
  { name: "Oostende", slug: "oostende" },
  { name: "Kortrijk", slug: "kortrijk" },
  { name: "Aalst", slug: "aalst" },
  { name: "Brussel", slug: "brussel" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl">Buitendrogen.be</span>
            </div>
            <p className="text-gray-400 text-sm">
              Gratis tool om te berekenen hoe lang je was nodig heeft om buiten te drogen.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigatie</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-sky-400 transition">Calculator</Link></li>
              <li><Link href="/over-mij" className="hover:text-sky-400 transition">Over de maker</Link></li>
              <li><a href="mailto:info@hazier.be" className="hover:text-sky-400 transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Populaire steden</h3>
            <ul className="space-y-2 text-gray-400">
              {popularCities.slice(0, 5).map((city) => (
                <li key={city.slug}>
                  <Link href={`/${city.slug}`} className="hover:text-sky-400 transition">Droogweer {city.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Meer tools</h3>
            <ul className="space-y-2 text-gray-400">
              {tools.slice(0, 5).map((tool) => (
                <li key={tool.name}>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition">{tool.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-gray-400 text-sm mb-4">
            Affiliate disclosure: sommige links op deze site zijn commerciele (affiliate) links.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {new Date().getFullYear()} Buitendrogen.be - Gemaakt door{" "}
              <a href="https://hazier.be" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300">Hazier</a>
            </p>
            <div className="flex gap-4 text-gray-500 text-sm">
              <Link href="/over-mij" className="hover:text-sky-400 transition">Over Mij</Link>
              <span>|</span>
              <a href="mailto:info@hazier.be" className="hover:text-sky-400 transition">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
