'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import FloatingShare from './components/FloatingShare';
import AnimatedHero from './components/AnimatedHero';

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number; // m/s
  clouds: number; // %
  description: string;
  icon: string;
}

interface DryingResult {
  hours: number;
  minutes: number;
  rating: 'uitstekend' | 'goed' | 'matig' | 'slecht' | 'ongeschikt';
  tips: string[];
  factors: {
    tempScore: number;
    humidityScore: number;
    windScore: number;
    sunScore: number;
  };
}

const supportingGuides = [
  {
    href: '/gids/was-buiten-drogen-winter',
    title: 'Was buiten drogen in de winter',
    description: 'Wat werkt bij vorst, wat niet, en hoe je winterwas sneller droogt.',
  },
  {
    href: '/gids/was-buiten-drogen-bij-hoge-luchtvochtigheid',
    title: 'Buiten drogen bij hoge luchtvochtigheid',
    description: 'Praktische aanpak voor vochtige dagen in Belgie.',
  },
  {
    href: '/gids/was-buiten-drogen-15-graden',
    title: 'Droogtijd bij 15 graden',
    description: 'Realistische timing voor typisch voorjaarsweer.',
  },
  {
    href: '/gids/beste-moment-om-was-buiten-te-hangen',
    title: 'Beste moment om op te hangen',
    description: 'Plan op uurvensters en vermijd avondvocht.',
  },
];

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [result, setResult] = useState<DryingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wasType, setWasType] = useState<'normaal' | 'dik' | 'delicaat'>('normaal');

  const calculateDryingTime = (w: WeatherData, type: string): DryingResult => {
    // Base drying time in minutes (for normal clothes on average day)
    let baseTime = 180; // 3 hours

    // Adjust for clothing type
    if (type === 'dik') baseTime = 300; // 5 hours for thick items
    if (type === 'delicaat') baseTime = 150; // 2.5 hours for delicate

    // Temperature factor (optimal: 20-30°C)
    let tempScore = 0;
    if (w.temp >= 25) tempScore = 100;
    else if (w.temp >= 20) tempScore = 80;
    else if (w.temp >= 15) tempScore = 60;
    else if (w.temp >= 10) tempScore = 40;
    else if (w.temp >= 5) tempScore = 20;
    else tempScore = 0;

    const tempMultiplier = 1 + (50 - tempScore) / 100;

    // Humidity factor (optimal: <50%)
    let humidityScore = 0;
    if (w.humidity <= 40) humidityScore = 100;
    else if (w.humidity <= 50) humidityScore = 80;
    else if (w.humidity <= 60) humidityScore = 60;
    else if (w.humidity <= 70) humidityScore = 40;
    else if (w.humidity <= 80) humidityScore = 20;
    else humidityScore = 0;

    const humidityMultiplier = 1 + (100 - humidityScore) / 100;

    // Wind factor (optimal: >15 km/h)
const windKmh = w.windSpeed * 3.6;
    let windScore = 0;
    if (windKmh >= 20) windScore = 100;
    else if (windKmh >= 15) windScore = 80;
    else if (windKmh >= 10) windScore = 60;
    else if (windKmh >= 5) windScore = 40;
    else windScore = 20;

    const windMultiplier = 1 - windScore / 200;

    // Sun/clouds factor (optimal: <20% clouds)
    let sunScore = 0;
    if (w.clouds <= 20) sunScore = 100;
    else if (w.clouds <= 40) sunScore = 80;
    else if (w.clouds <= 60) sunScore = 60;
    else if (w.clouds <= 80) sunScore = 40;
    else sunScore = 20;

    const sunMultiplier = 1 + (100 - sunScore) / 200;

    // Calculate total time
    let totalMinutes = baseTime * tempMultiplier * humidityMultiplier * windMultiplier * sunMultiplier;
    totalMinutes = Math.max(0, Math.round(totalMinutes));

    // Determine rating
const avgScore = (tempScore + humidityScore + windScore + sunScore) / 4;
    let rating: DryingResult['rating'];
    if (avgScore >= 80) rating = 'uitstekend';
    else if (avgScore >= 60) rating = 'goed';
    else if (avgScore >= 40) rating = 'matig';
    else if (avgScore >= 20) rating = 'slecht';
    else rating = 'ongeschikt';

    // Generate tips
const tips: string[] = [];
    if (w.humidity > 70) tips.push('Hoge luchtvochtigheid - overweeg binnen te drogen');
    if (w.temp < 10) tips.push('Lage temperatuur - drogen duurt langer');
    if (windKmh < 5) tips.push('Weinig wind - hang was op een open plek');
    if (w.clouds > 80) tips.push('Bewolkt - minder zonwarmte beschikbaar');
    if (avgScore >= 70) tips.push('Goed wasweer: hang je was gerust buiten');
    if (w.temp > 25 && w.humidity < 50) tips.push('Ideale condities voor snel drogen');

    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      rating,
      tips,
      factors: { tempScore, humidityScore, windScore, sunScore },
    };
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Vul een plaatsnaam in');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);
    setResult(null);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Kon weer niet ophalen');
      setWeather(data);
      setResult(calculateDryingTime(data, wasType));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: typeof wasType) => {
    setWasType(type);
    if (weather) setResult(calculateDryingTime(weather, type));
  };

  const getRatingColor = (rating: DryingResult['rating']) => {
    switch (rating) {
      case 'uitstekend':
        return 'bg-green-500';
      case 'goed':
        return 'bg-green-400';
      case 'matig':
        return 'bg-yellow-500';
      case 'slecht':
        return 'bg-orange-500';
      case 'ongeschikt':
        return 'bg-red-500';
    }
  };

  return (
    <>
      <Header />
      <FloatingShare />
      <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <AnimatedHero />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/70 backdrop-blur rounded-2xl border border-sky-100 shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Wanneer kan je was best buiten drogen?</h2>
            <p className="mt-3 text-gray-700">
              Buiten drogen hangt vooral af van <strong>temperatuur</strong>, <strong>luchtvochtigheid</strong>,
              <strong> wind</strong> en <strong>zon/bewolking</strong>. Deze tool combineert die factoren tot een
              schatting van je droogtijd.
            </p>
            <p className="mt-3 text-gray-700">
              Tip: zelfs bij lagere temperaturen kan was drogen als de lucht droog is en er voldoende wind staat.
            </p>

            <div className="mt-6 grid sm:grid-cols-4 gap-4 text-sm">
              <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
                <strong>Warm</strong>
                <div className="text-gray-600 mt-1">sneller drogen</div>
              </div>
              <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
                <strong>Droge lucht</strong>
                <div className="text-gray-600 mt-1">meer verdamping</div>
              </div>
              <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
                <strong>Wind</strong>
                <div className="text-gray-600 mt-1">voert vocht af</div>
              </div>
              <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
                <strong>Zon</strong>
                <div className="text-gray-600 mt-1">extra warmte</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bereken droogtijd</h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Jouw locatie</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
                  placeholder="Bijv. Gent, Antwerpen, Brussel..."
                  className="flex-1 min-w-0 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none text-lg"
                />
                <button
                  onClick={fetchWeather}
                  disabled={loading}
                  className="shrink-0 px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
                >
                  {loading ? '...' : 'Check'}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Type wasgoed</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'normaal', label: 'Normaal', desc: 'T-shirts, ondergoed' },
                  { id: 'dik', label: 'Dik', desc: 'Handdoeken, jeans' },
                  { id: 'delicaat', label: 'Delicaat', desc: 'Fijne stoffen' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeChange(type.id as typeof wasType)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all ${
                      wasType === type.id
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{type.label}</span>
                    <span className="text-sm text-gray-500 block">{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>
            )}

            {weather && result && (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-3">Huidige weersomstandigheden in {city}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{weather.temp.toFixed(1)}°C</div>
                      <div className="text-sm text-gray-500">Temperatuur</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{weather.humidity}%</div>
                      <div className="text-sm text-gray-500">Luchtvochtigheid</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{(weather.windSpeed * 3.6).toFixed(0)} km/u</div>
                      <div className="text-sm text-gray-500">Wind</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{weather.clouds}%</div>
                      <div className="text-sm text-gray-500">Bewolking</div>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl text-white ${getRatingColor(result.rating)}`}>
                  <div className="text-center">
                    <div className="text-lg opacity-90 mb-1">Geschatte droogtijd</div>
                    <div className="text-4xl font-bold mb-2">
                      {result.hours > 0 && `${result.hours} uur `}
                      {result.minutes > 0 && `${result.minutes} min`}
                      {result.hours === 0 && result.minutes === 0 && 'Direct droog'}
                    </div>
                    <div className="text-xl font-semibold capitalize">{result.rating}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Temperatuur', score: result.factors.tempScore },
                    { label: 'Luchtvochtigheid', score: result.factors.humidityScore },
                    { label: 'Wind', score: result.factors.windScore },
                    { label: 'Zon', score: result.factors.sunScore },
                  ].map((factor) => (
                    <div key={factor.label} className="bg-gray-50 p-3 rounded-xl text-center">
                      <div className="text-sm text-gray-600">{factor.label}</div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            factor.score >= 60 ? 'bg-green-500' : factor.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                      <div className="text-sm font-semibold mt-1">{factor.score}%</div>
                    </div>
                  ))}
                </div>

                {result.tips.length > 0 && (
                  <div className="bg-sky-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-sky-800 mb-2">Tips</h3>
                    <ul className="space-y-1">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="text-sky-700">• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Table of Contents */}
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Inhoudsopgave</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="#hoe-werkt-berekening" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">🔍</span>
                Hoe werkt de berekening?
              </a>
              <a href="#tips-sneller-drogen" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">⚡</span>
                Tips voor sneller buiten drogen
              </a>
              <a href="#droogtijd-per-kledingstuk" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">👕</span>
                Droogtijd per kledingstuk
              </a>
              <a href="#buiten-drogen-per-seizoen" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">🌤️</span>
                Buiten drogen per seizoen
              </a>
              <a href="#checklist" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">✅</span>
                Buiten drogen checklist
              </a>
              <a href="#vergelijking-droogmethodes" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">⚖️</span>
                Vergelijking droogmethodes
              </a>
              <a href="#regionale-tips" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">🗺️</span>
                Regionale droogtips
              </a>
              <a href="#praktische-gidsen" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">G</span>
                Praktische gidsen
              </a>
              <a href="#alles-over-belgie" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">🇧🇪</span>
                Alles over buiten drogen in België
              </a>
              <a href="#veelgestelde-vragen" className="flex items-center py-2 px-3 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-lg transition-colors">
                <span className="mr-2">❓</span>
                Veelgestelde vragen
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="praktische-gidsen" className="text-2xl font-bold text-gray-800 mb-3">
              Praktische gidsen rond buiten drogen
            </h2>
            <p className="text-gray-600 mb-5">
              Op basis van veelgestelde zoekvragen hebben we vier extra gidsen toegevoegd.
              Elke gids behandelt een specifiek droogscenario en linkt terug naar de calculator.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {supportingGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="rounded-xl border border-gray-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{guide.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/gids" className="inline-block text-sm font-medium text-sky-700 hover:text-sky-900">
                Bekijk alle gidsen
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="hoe-werkt-berekening" className="text-2xl font-bold text-gray-800 mb-4">Hoe werkt de berekening?</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">De droogtijd van je was hangt af van vier belangrijke factoren:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold">Temperatuur</h3>
                  <p className="text-sm text-gray-600">Hoe warmer, hoe sneller het vocht verdampt. Ideaal: 20-30°C.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold">Luchtvochtigheid</h3>
                  <p className="text-sm text-gray-600">Lage luchtvochtigheid zorgt voor snellere verdamping. Ideaal: onder 50%.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold">Wind</h3>
                  <p className="text-sm text-gray-600">Wind voert vochtige lucht af en versnelt het drogen. Ideaal: meer dan 15 km/u.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold">Zon</h3>
                  <p className="text-sm text-gray-600">Zonnestraling verwarmt de kleding direct. Minder bewolking = sneller droog.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="tips-sneller-drogen" className="text-2xl font-bold text-gray-800 mb-4">Tips voor sneller buiten drogen</h2>
            <ul className="space-y-3 text-gray-600">
              <li>
                <strong>Centrifugeer goed</strong> - Hoe minder water in de was, hoe sneller het droogt
              </li>
              <li>
                <strong>Geef ruimte</strong> - Hang items met voldoende tussenruimte voor luchtcirculatie
              </li>
              <li>
                <strong>Kies de juiste plek</strong> - Zonnig, winderig en open terrein werkt het best
              </li>
              <li>
                <strong>Keer halverwege</strong> - Draai dikke items na verloop van tijd om
              </li>
              <li>
                <strong>Let op het weer</strong> - Check de voorspelling om regen te vermijden
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="veelgestelde-vragen" className="text-2xl font-bold text-gray-800 mb-4">Veelgestelde vragen</h2>
            <div className="space-y-3">
              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Kan ik was buiten drogen in de winter?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Ja, zelfs bij temperaturen rond of onder het vriespunt kan was buiten drogen. Dit gebeurt via sublimatie: het water in je kleding gaat rechtstreeks van ijs over naar waterdamp, zonder eerst vloeibaar te worden. Dit werkt het best bij droog winterweer met een lage luchtvochtigheid en wat wind. Het duurt wel aanzienlijk langer dan in de zomer — reken op een hele dag. Vermijd regenachtige of mistige winterdagen, want dan is de lucht al te vochtig om extra vocht op te nemen.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Wat is beter: buiten drogen of de droger?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Buiten drogen is vrijwel altijd de betere keuze als het weer het toelaat. Je bespaart gemiddeld 2 tot 4 kWh per droogbeurt, wat neerkomt op zo&apos;n €0,60 tot €1,20 per keer. Bovendien is buiten drogen veel zachter voor je kleding: vezels slijten minder, kleuren blijven langer mooi en elastiek behoudt zijn veerkracht. Een wasdroger is handig bij slecht weer, tijdsdruk of voor wie geen buitenruimte heeft, maar de slijtage aan kleding is merkbaar hoger.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Kan was te lang buiten hangen?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Ja, langdurig buiten hangen kan nadelig zijn. Fel zonlicht bevat UV-straling die kleuren doet vervagen, vooral bij donkere of felgekleurde kledingstukken. Delicate stoffen zoals zijde of viscose kunnen bovendien bros worden door te lange blootstelling aan zon en wind. Als je was al droog is, haal ze dan zo snel mogelijk binnen. Hang gekleurde items bij voorkeur binnenstebuiten op of kies een plek in de halfschaduw om verkleuring te voorkomen.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Waarom ruikt buiten gedroogde was zo lekker?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Die heerlijke frisse geur van buitengedroogde was heeft een wetenschappelijke verklaring. UV-straling van de zon doodt bacteriën en schimmels die geurtjes veroorzaken. Daarnaast speelt ozon — een molecule die in kleine hoeveelheden in de buitenlucht aanwezig is — een rol als natuurlijk ontgeurringsmiddel. De combinatie van wind, zon en frisse lucht zorgt voor een geur die geen enkel wasverzachter kan evenaren. Dit effect is het sterkst op zonnige dagen met een lichte bries.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Bij welke temperatuur droogt was het snelst?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Was droogt het snelst bij temperaturen boven 25°C in combinatie met een lage luchtvochtigheid. Warmere lucht kan namelijk meer vocht opnemen dan koude lucht, waardoor verdamping sneller gaat. Maar temperatuur alleen is niet allesbepalend: een dag van 15°C met droge lucht en stevige wind kan effectiever zijn dan een vochtige, windstille dag van 28°C. In België heb je de beste droogomstandigheden doorgaans van mei tot september, wanneer temperatuur en luchtvochtigheid samen het gunstigst zijn.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Hoelang duurt het om was buiten te drogen?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  De droogtijd varieert sterk afhankelijk van het weer en het type wasgoed. Op een warme zomerdag met zon en wind zijn dunne T-shirts en ondergoed al droog in 1 tot 2 uur. Normale was zoals katoenen kleding heeft gemiddeld 2 tot 4 uur nodig. Dikke items zoals handdoeken, jeans of hoodies kunnen 4 tot 8 uur duren. Op koelere of vochtigere dagen moet je rekenen op een halve tot een hele dag. Gebruik onze calculator hierboven voor een nauwkeurige schatting op basis van het actuele weer.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Kan ik was buiten drogen als het bewolkt is?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Absoluut. Bewolking vermindert de directe zonnestraling, maar was droogt ook prima zonder zon. Wind en lage luchtvochtigheid zijn eigenlijk belangrijker dan zonlicht voor het droogproces. Op een bewolkte dag met een frisse bries en droge lucht droogt je was nog altijd goed, al duurt het iets langer dan op een zonnige dag. In België zijn licht bewolkte dagen met wind ideaal — je kleding droogt én de kleuren vervagen minder door het ontbreken van felle UV-straling.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Wat doe ik als het begint te regenen terwijl mijn was buiten hangt?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Als er een korte bui voorbijtrekt, is er niet meteen reden tot paniek. Een lichte regenbui maakt je was nat, maar zodra de zon doorbreekt en de wind aantrekt, droogt alles weer snel op. Bij langdurige of hevige regen haal je de was best zo snel mogelijk binnen. Een overkapping of veranda kan uitkomst bieden. Tip: check altijd de weersverwachting voordat je was buitenhangt en plan je wasbeurt rond een droog blok van minstens een paar uur.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Droogt donkere was sneller dan witte was?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Donkere kleding absorbeert meer zonlicht en wordt daardoor warmer, wat de verdamping iets kan versnellen. Het verschil is in de praktijk echter klein — het type stof en de dikte van het materiaal hebben een veel grotere invloed dan de kleur. Een dunne witte katoenen T-shirt droogt sneller dan een dikke donkere hoodie. Let wel op: donkere was kan sneller verkleuren in de zon, dus hang ze bij voorkeur binnenstebuiten of in de halfschaduw.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Hoeveel energie bespaar je door buiten te drogen?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Een gemiddelde wasdroger verbruikt tussen de 2 en 4,5 kWh per droogcyclus, afhankelijk van het type (condensdroger, warmtepomp of luchtafvoer). Bij een elektriciteitsprijs van circa €0,30 per kWh bespaar je al snel €0,60 tot €1,35 per beurt. Wie drie keer per week wast en buiten droogt in plaats van de droger te gebruiken, bespaart jaarlijks tot €200 op de energierekening. Bovendien vermijd je de CO₂-uitstoot van zo&apos;n 150 tot 350 kg per jaar — goed voor het milieu én je portemonnee.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Kan ik dekens en donsdekken buiten drogen?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Ja, maar het vergt wat extra aandacht. Dekens en donsdekken zijn zwaar en dik, waardoor ze lang nodig hebben om volledig te drogen — reken op een volledige dag bij goed weer. Hang ze over een stevige waslijn of droogrek zodat er aan beide kanten lucht bij kan. Schud donsdekken regelmatig op tijdens het drogen om klontvorming te voorkomen. Kies een droge, zonnige dag met wind. Controleer voor je ze binnenbrengt of ze écht helemaal droog zijn, want restvocht kan schimmelvorming veroorzaken.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Wat is het beste moment van de dag om was buiten te hangen?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Het ideale moment is &apos;s ochtends vroeg, tussen 8 en 10 uur. De luchtvochtigheid daalt naarmate de dag vordert en de temperatuur stijgt, waardoor je was het meeste profijt heeft van de droogste uren van de dag — doorgaans tussen 11 en 16 uur. Door &apos;s ochtends te starten, benut je het volledige droogvenster. Vermijd het om was &apos;s avonds laat buiten te hangen, want de luchtvochtigheid stijgt dan weer en je was kan dauwnat worden in de nacht.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Kan ik babykleding veilig buiten drogen?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Ja, babykleding kan prima buiten drogen en is zelfs aan te raden. De natuurlijke antibacteriële werking van UV-licht van de zon helpt schadelijke bacteriën te doden, wat juist goed is voor de gevoelige huid van jonge kinderen. Vermijd wel het gebruik van geparfumeerde wasverzachters en was babykleding apart van de rest om kruisbesmetting te voorkomen. Hang babykleertjes bij voorkeur niet direct in de felle middagzon om verkleuring te vermijden, en zorg ervoor dat ze volledig droog zijn voor je ze opvouwt.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Is buiten drogen hygiënisch genoeg?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Buiten drogen is zelfs hygiënischer dan de meeste andere droogmethodes. UV-straling van zonlicht heeft een sterke desinfecterende werking en doodt bacteriën, schimmels en virussen die wasdrogers niet aankunnen. Verse buitenlucht transporteert micro-organismen weg in plaats van ze rond te blazen in een gesloten systeem. Wel belangrijk: zorg dat je waslijn schoon is, gebruik schone knijpers, en hang nooit vochtige was direct op een vuile ondergrond. Bij zeer vervuilde buitenlucht (bijvoorbeeld tijdens sahara-stof of smog) kun je beter binnen drogen.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Hoe voorkom ik dat mijn was stijf wordt na buiten drogen?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Stijve was na buiten drogen ontstaat doordat natuurlijke mineralen uit hard water in de vezels achterblijven wanneer het water verdampt. Dit kun je grotendeels voorkomen door: 1) Een scheutje witte azijn toe te voegen aan de spoelgang (100ml voor een normale was), 2) Was goed uitschudden voordat je het ophangt en nogmaals als je het binnenhaalt, 3) Kleding binnenhalen zodra het droog is, niet uren later, 4) Een klein beetje wasverzachter gebruiken (minder dan aangegeven op de verpakking). Handdoeken worden vaak het stijfst — schud deze extra goed uit.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Mag je was buiten drogen in een appartementsgebouw?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Dit hangt af van je huurcontract, VvE-reglement en gemeentelijke verordeningen. In de meeste Belgische gemeenten is buiten drogen vanaf de begane grond toegestaan, maar check altijd eerst de lokale regels. Sommige appartementsgebouwen hebben specifieke regels over was op balkons vanwege het uitzicht of druppelwater. Veelvoorkomende beperkingen: geen was aan de straatkant, alleen witte was zichtbaar, of alleen op bepaalde tijden. Als buiten drogen niet mag, zijn gemeenschappelijke droogzolders of wasruimtes vaak een goed alternatief. Informeer bij je verhuurder of VvE-beheerder.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Helpt wasverzachter bij buiten drogen?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Wasverzachter kan inderdaad helpen, vooral om stijfheid te voorkomen die soms optreedt bij buiten drogen. Het legt een dunne laag rond de vezels die ze soepel houdt. Gebruik echter minder dan de aanbevolen hoeveelheid — een derde van de aanbevolen dosis is vaak genoeg. Te veel wasverzachter kan de absorptie van handdoeken verminderen en gevoelige huid irriteren. Een natuurlijk alternatief is witte huishoudazijn (100ml in de spoelgang): dit werkt net zo goed tegen stijfheid en heeft bovendien een ontkalking effect. Voor milieubewuste huishoudens: moderne eco-wasverzachters werken prima en belasten het milieu minder.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Kan ik wollen kleding buiten drogen?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Wollen kleding vergt extra zorg bij buiten drogen. Hang wol nooit rechtop aan een waslijn — dit veroorzaakt uitrekking. Leg wollen items horizontaal op een droogrek of handdoekrek, bij voorkeur in de schaduw want direct zonlicht kan wol doen krimpen en verkleuren. Zorg voor goede luchtcirculatie en draai het kledingstuk om zodra de bovenkant droog is. Vermijd buiten drogen bij harde wind die aan de wol kan trekken. Kasjmier en andere delicate wol droog je beter binnen op een handdoek. Schudde wol nooit hard uit — knijp overtollig water er voorzichtig uit en vorm het kledingstuk terug in de juiste vorm voordat je het laat drogen.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Waarom droogt mijn was niet goed ondanks goed weer?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Er kunnen verschillende oorzaken zijn: 1) Te dicht opgehangen — was heeft ruimte nodig voor luchtcirculatie, 2) Niet goed gecentrifugeerd — moderne wasmachines kunnen vaak tot 1400 toeren, gebruik dit, 3) Te dikke lagen — vouw lakens en handdoeken maar één keer dubbel, 4) Schaduwrijke locatie — ook bij warm weer droogt was slecht zonder luchtstroom, 5) Hoge luchtvochtigheid ondanks goede temperatuur — check dit via weer-apps, 6) Vervuilde waslijn — vuil en vet houden vocht vast. Probeer onze calculator hierboven voor een objectieve inschatting van de droogomstandigheden.
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <summary className="cursor-pointer p-4 font-semibold text-gray-800 hover:bg-gray-50 rounded-lg select-none">
                  Is het waar dat was sneller droogt op een bewolkte, winderige dag dan op een windstille zonnige dag?
                </summary>
                <div className="p-4 pt-0 text-gray-600">
                  Ja, dat kan inderdaad waar zijn! Wind is vaak belangrijker voor drogen dan zonlicht. Een bewolkte dag met stevige wind (&gt;20 km/u) en lage luchtvochtigheid kan effectiever zijn dan een windstille zonnige dag met hoge luchtvochtigheid. Wind voert voortdurend vochtige lucht weg en brengt droge lucht aan, terwijl zonlicht alleen verhit. De ideale combinatie is natuurlijk zon én wind. Dit is waarom onze calculator alle vier de factoren (temperatuur, luchtvochtigheid, wind, bewolking) meeneemt in plaats van alleen naar de temperatuur te kijken. Het verklaart ook waarom was soms sneller droogt in de herfst dan op een warme maar vochtige zomerdag.
                </div>
              </details>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="alles-over-belgie" className="text-2xl font-bold text-gray-800 mb-4">Alles over buiten drogen in België</h2>
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <p>
                Buiten drogen is een van de eenvoudigste manieren om energie te besparen en je ecologische voetafdruk te verkleinen. In België, waar de gemiddelde energieprijs tot de hoogste van Europa behoort, is elke kilowattuur die je niet verbruikt pure winst. Een doorsnee wasdroger verbruikt tussen de 2 en 4,5 kWh per cyclus. Wie regelmatig buiten droogt in plaats van de droger te gebruiken, kan jaarlijks tot €200 besparen op de elektriciteitsrekening. Dat is niet alleen goed voor je portemonnee, maar ook voor het klimaat: je vermijdt zo honderden kilogram CO₂-uitstoot per jaar.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">Seizoenstips voor buiten drogen in België</h3>
              <p>
                Het Belgische klimaat is grillig, maar biedt meer droogmogelijkheden dan je zou denken. In de <strong>lente</strong> (maart-mei) krijg je steeds meer zonnige dagen met frisse wind — ideaal om het droogseizoen te starten. De <strong>zomer</strong> (juni-augustus) is uiteraard het topseizoen: lange dagen, hoge temperaturen en vaak lage luchtvochtigheid zorgen voor snelle droogtijden van soms minder dan een uur voor dunne kleding. In de <strong>herfst</strong> (september-november) neemt de luchtvochtigheid toe, maar op droge dagen met wind droogt was nog prima. Zelfs in de <strong>winter</strong> kan was buiten drogen via sublimatie — al moet je dan geduld hebben en een droge, koude dag kiezen.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">Verschil in stoffen en droogtijd</h3>
              <p>
                Niet alle stoffen drogen even snel. Synthetische materialen zoals polyester en nylon nemen weinig vocht op en drogen bijzonder snel, vaak binnen een uur. Katoen daarentegen houdt veel water vast en heeft daardoor meer tijd nodig. Wol en denim zijn bijzonder traag — reken voor een spijkerbroek op 4 tot 6 uur bij goed weer. Delicate stoffen zoals zijde en viscose drogen redelijk snel, maar zijn gevoelig voor UV-straling en wind, dus hang ze bij voorkeur in de schaduw. Microvezelhanddoeken zijn een handige uitzondering: ze absorberen veel maar geven vocht ook snel weer af.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">Waslijntips en droogrekken</h3>
              <p>
                De manier waarop je je was ophangt maakt een groot verschil. Zorg voor voldoende ruimte tussen de kledingstukken zodat de lucht er goed tussendoor kan stromen. Hang T-shirts op aan de onderkant om schouderafdrukken van knijpers te voorkomen. Overhemden en blouses hang je best op een kledinghanger aan de lijn. Lakens en handdoeken vouw je dubbel over de lijn met een overlapping van ongeveer 15 centimeter, zodat beide kanten goed aan de lucht worden blootgesteld. Gebruik bij voorkeur een waslijn op een open, zonnige plek die niet in de schaduw staat van gebouwen of bomen.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">Buiten drogen versus binnen drogen</h3>
              <p>
                Binnen drogen op een droogrek is een populair alternatief wanneer het weer niet meewerkt, maar het heeft enkele nadelen. Natte was geeft veel vocht af aan de binnenlucht, wat kan leiden tot condensatie op ramen, vochtproblemen en zelfs schimmelvorming — een veelvoorkomend probleem in Belgische woningen. Als je toch binnen droogt, zorg dan voor goede ventilatie: zet een raam op een kier of gebruik een afzuigventilator. Buiten drogen vermijdt al deze problemen volledig en levert bovendien een frisser eindresultaat op dankzij de natuurlijke antibacteriële werking van UV-licht.
              </p>

              <h3 className="text-lg font-semibold text-gray-800">Milieu-impact en duurzaamheid</h3>
              <p>
                De milieu-impact van wasdrogen wordt vaak onderschat. Huishoudelijke wasdrogers zijn verantwoordelijk voor een aanzienlijk deel van het residentiële energieverbruik. Door over te stappen op buiten drogen draag je actief bij aan de energietransitie. Het is een kleine moeite met een groot effect — zeker als je bedenkt dat het enige wat je nodig hebt een waslijn of droogrek is, een paar knijpers en een beetje geduld. In tijden van stijgende energieprijzen en groeiend klimaatbewustzijn is buiten drogen niet alleen slim, maar ook een bewuste keuze voor een duurzamere levensstijl.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="droogtijd-per-kledingstuk" className="text-2xl font-bold text-gray-800 mb-6">Droogtijd per kledingstuk</h2>
            <p className="text-gray-600 mb-6">Geschatte droogtijden bij verschillende weersomstandigheden. Deze tijden zijn richtwaarden — gebruik onze calculator hierboven voor een nauwkeurige voorspelling.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-sky-50 border border-sky-100">
                    <th className="p-3 text-left font-semibold text-gray-800">Kledingstuk</th>
                    <th className="p-3 text-center font-semibold text-gray-800">Goed weer<br/><span className="text-sm font-normal">(25°C, 40% RV, wind)</span></th>
                    <th className="p-3 text-center font-semibold text-gray-800">Slecht weer<br/><span className="text-sm font-normal">(15°C, 80% RV, weinig wind)</span></th>
                    <th className="p-3 text-center font-semibold text-gray-800">Tips</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-200">
                    <td className="p-3 font-medium">T-shirt (katoen)</td>
                    <td className="p-3 text-center text-green-600 font-semibold">1-2 uur</td>
                    <td className="p-3 text-center text-orange-600 font-semibold">4-6 uur</td>
                    <td className="p-3 text-sm text-gray-600">Hang aan onderkant op</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-200">
                    <td className="p-3 font-medium">Spijkerbroek</td>
                    <td className="p-3 text-center text-green-600 font-semibold">3-4 uur</td>
                    <td className="p-3 text-center text-orange-600 font-semibold">8-12 uur</td>
                    <td className="p-3 text-sm text-gray-600">Binnenstebuiten hangen</td>
                  </tr>
                  <tr className="border border-gray-200">
                    <td className="p-3 font-medium">Handdoek</td>
                    <td className="p-3 text-center text-green-600 font-semibold">2-3 uur</td>
                    <td className="p-3 text-center text-orange-600 font-semibold">6-8 uur</td>
                    <td className="p-3 text-sm text-gray-600">Goed uitschudden eerst</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-200">
                    <td className="p-3 font-medium">Laken</td>
                    <td className="p-3 text-center text-green-600 font-semibold">1-2 uur</td>
                    <td className="p-3 text-center text-orange-600 font-semibold">4-6 uur</td>
                    <td className="p-3 text-sm text-gray-600">Dubbel over de lijn</td>
                  </tr>
                  <tr className="border border-gray-200">
                    <td className="p-3 font-medium">Hoodie/trui</td>
                    <td className="p-3 text-center text-green-600 font-semibold">4-6 uur</td>
                    <td className="p-3 text-center text-orange-600 font-semibold">12-24 uur</td>
                    <td className="p-3 text-sm text-gray-600">Horizontaal drogen</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-200">
                    <td className="p-3 font-medium">Sokken</td>
                    <td className="p-3 text-center text-green-600 font-semibold">30-60 min</td>
                    <td className="p-3 text-center text-orange-600 font-semibold">2-4 uur</td>
                    <td className="p-3 text-sm text-gray-600">Aan teen ophangen</td>
                  </tr>
                  <tr className="border border-gray-200">
                    <td className="p-3 font-medium">Ondergoed</td>
                    <td className="p-3 text-center text-green-600 font-semibold">30-45 min</td>
                    <td className="p-3 text-center text-orange-600 font-semibold">2-3 uur</td>
                    <td className="p-3 text-sm text-gray-600">Snelste drogers</td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-200">
                    <td className="p-3 font-medium">Sportkleding</td>
                    <td className="p-3 text-center text-green-600 font-semibold">45-90 min</td>
                    <td className="p-3 text-center text-orange-600 font-semibold">3-5 uur</td>
                    <td className="p-3 text-sm text-gray-600">Synthetische vezels</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="buiten-drogen-per-seizoen" className="text-2xl font-bold text-gray-800 mb-6">Buiten drogen per seizoen</h2>
            <p className="text-gray-600 mb-6">Elk seizoen heeft zijn eigen uitdagingen en voordelen voor het drogen van was. Hier vind je wat je kunt verwachten.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 border border-green-100 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🌸</span>
                  <h3 className="text-xl font-bold text-gray-800">Lente (maart-mei)</h3>
                  <div className="ml-auto flex text-yellow-500">
                    <span>⭐⭐⭐⭐</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Ideale condities:</strong> 15-20°C, frisse bries, wisselend bewolkt</div>
                  <div><strong>Gemiddelde droogtijd:</strong> 3-5 uur voor normale was</div>
                  <div><strong>Aandachtspunten:</strong> Plotse buien mogelijk, pollen in de lucht</div>
                  <div className="text-green-700"><strong>Tip:</strong> Perfect seizoen om weer te beginnen met buiten drogen!</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">☀️</span>
                  <h3 className="text-xl font-bold text-gray-800">Zomer (juni-augustus)</h3>
                  <div className="ml-auto flex text-yellow-500">
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Ideale condities:</strong> 25-30°C, droge lucht, veel zon</div>
                  <div><strong>Gemiddelde droogtijd:</strong> 1-3 uur voor normale was</div>
                  <div><strong>Aandachtspunten:</strong> Verkleuring door UV, was kan te droog worden</div>
                  <div className="text-green-700"><strong>Tip:</strong> Hang donkere was binnenstebuiten op</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🍂</span>
                  <h3 className="text-xl font-bold text-gray-800">Herfst (sept-nov)</h3>
                  <div className="ml-auto flex text-yellow-500">
                    <span>⭐⭐⭐</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Ideale condities:</strong> 12-18°C, stevige wind, droge periodes</div>
                  <div><strong>Gemiddelde droogtijd:</strong> 4-8 uur voor normale was</div>
                  <div><strong>Aandachtspunten:</strong> Hogere luchtvochtigheid, kortere dagen</div>
                  <div className="text-green-700"><strong>Tip:</strong> Hang vroeg op de dag, voor de avonddauw</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">❄️</span>
                  <h3 className="text-xl font-bold text-gray-800">Winter (dec-feb)</h3>
                  <div className="ml-auto flex text-yellow-500">
                    <span>⭐⭐</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Ideale condities:</strong> Droge vorst, heldere dagen, stevige wind</div>
                  <div><strong>Gemiddelde droogtijd:</strong> 6-24 uur (via sublimatie)</div>
                  <div><strong>Aandachtspunten:</strong> Was kan bevriezen, veel geduld nodig</div>
                  <div className="text-green-700"><strong>Tip:</strong> Alleen bij droog winterweer, binnen als alternatief</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="checklist" className="text-2xl font-bold text-gray-800 mb-6">Buiten drogen checklist</h2>
            <p className="text-gray-600 mb-6">Loop deze checklist af voordat je je was buiten hangt om teleurstellingen te voorkomen.</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">☀️ Weersverwachting gecontroleerd?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">🌧️ Regenvrije periode van minstens 4 uur?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">🌀 Genoeg wind (&gt;10 km/u)?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">📏 Waslijn/droogrek vrij en schoon?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">📎 Voldoende wasknijpers beschikbaar?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">💧 Was goed gecentrifugeerd?</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">🎯 Droge, zonnige plek gekozen?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">🔄 Donkere kleding binnenstebuiten?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">📐 Voldoende ruimte tussen kledingstukken?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">⏰ Tijd om was op tijd binnen te halen?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">🏠 Plan B klaar als het regent?</span>
                </div>
                <div className="flex items-center bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-sky-600" />
                  <span className="text-gray-700">🧺 Wasmand klaar voor als het droog is?</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="text-green-800">
                <strong>🎯 Pro tip:</strong> Sla deze pagina op als bladwijzer en gebruik de checklist elke keer. Na een paar keer wordt het routine!
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="vergelijking-droogmethodes" className="text-2xl font-bold text-gray-800 mb-6">Vergelijking droogmethodes</h2>
            <p className="text-gray-600 mb-6">Welke droogmethode past het best bij jouw situatie? Vergelijk de voor- en nadelen van elke optie.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-sky-50 border border-sky-100">
                    <th className="p-3 text-left font-semibold text-gray-800">Methode</th>
                    <th className="p-3 text-center font-semibold text-gray-800">Kosten<br/><span className="text-xs font-normal">per wasbeurt</span></th>
                    <th className="p-3 text-center font-semibold text-gray-800">Tijd</th>
                    <th className="p-3 text-center font-semibold text-gray-800">Milieu-impact</th>
                    <th className="p-3 text-center font-semibold text-gray-800">Effect op kleding</th>
                    <th className="p-3 text-center font-semibold text-gray-800">Geschiktheid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-gray-200">
                    <td className="p-3 font-medium text-green-700">🌞 Buiten drogen</td>
                    <td className="p-3 text-center">
                      <span className="text-green-600 font-semibold">€0,00</span><br/>
                      <span className="text-xs text-gray-500">Enkel elektriciteit wasmachine</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-orange-600">2-8 uur</span><br/>
                      <span className="text-xs text-gray-500">Afhankelijk van weer</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-green-600 font-semibold">Uitstekend</span><br/>
                      <span className="text-xs text-gray-500">Geen extra energie</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-green-600">Zeer zacht</span><br/>
                      <span className="text-xs text-gray-500">Natuurlijke frisheid</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-orange-600">Weerafhankelijk</span><br/>
                      <span className="text-xs text-gray-500">Buitenruimte nodig</span>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-200">
                    <td className="p-3 font-medium">🔥 Wasdroger (condensdroger)</td>
                    <td className="p-3 text-center">
                      <span className="text-red-600 font-semibold">€1,20</span><br/>
                      <span className="text-xs text-gray-500">4 kWh × €0,30</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-green-600">60-90 min</span><br/>
                      <span className="text-xs text-gray-500">Snel en betrouwbaar</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-red-600">Slecht</span><br/>
                      <span className="text-xs text-gray-500">Hoog energieverbruik</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-orange-600">Matig</span><br/>
                      <span className="text-xs text-gray-500">Slijtage door hitte</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-green-600">Altijd</span><br/>
                      <span className="text-xs text-gray-500">Onafhankelijk van weer</span>
                    </td>
                  </tr>
                  <tr className="border border-gray-200">
                    <td className="p-3 font-medium">🏠 Binnen op rek</td>
                    <td className="p-3 text-center">
                      <span className="text-green-600 font-semibold">€0,00</span><br/>
                      <span className="text-xs text-gray-500">Geen extra kosten</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-orange-600">6-12 uur</span><br/>
                      <span className="text-xs text-gray-500">Langzaam proces</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-green-600">Goed</span><br/>
                      <span className="text-xs text-gray-500">Geen extra energie</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-green-600">Zacht</span><br/>
                      <span className="text-xs text-gray-500">Geen hitteschade</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-orange-600">Beperkt</span><br/>
                      <span className="text-xs text-gray-500">Vochtproblemen mogelijk</span>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border border-gray-200">
                    <td className="p-3 font-medium">♻️ Warmtepomp droger</td>
                    <td className="p-3 text-center">
                      <span className="text-orange-600 font-semibold">€0,60</span><br/>
                      <span className="text-xs text-gray-500">2 kWh × €0,30</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-orange-600">120-180 min</span><br/>
                      <span className="text-xs text-gray-500">Langzamer dan condensdroger</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-orange-600">Redelijk</span><br/>
                      <span className="text-xs text-gray-500">Lager verbruik</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-green-600">Goed</span><br/>
                      <span className="text-xs text-gray-500">Lagere temperaturen</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-green-600">Altijd</span><br/>
                      <span className="text-xs text-gray-500">Beste droger-optie</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-2">🏆 Voor het milieu</h3>
                <p className="text-sm text-green-700">1. Buiten drogen<br/>2. Binnen op rek<br/>3. Warmtepomp droger<br/>4. Condensdroger</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">💰 Voor de portemonnee</h3>
                <p className="text-sm text-blue-700">1. Buiten/binnen (gratis)<br/>2. Warmtepomp droger<br/>3. Condensdroger</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-semibold text-purple-800 mb-2">⚡ Voor snelheid</h3>
                <p className="text-sm text-purple-700">1. Condensdroger<br/>2. Buiten (goed weer)<br/>3. Warmtepomp droger<br/>4. Binnen op rek</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 id="regionale-tips" className="text-2xl font-bold text-gray-800 mb-6">Regionale droogtips voor België</h2>
            <p className="text-gray-600 mb-6">België kent verschillende microklimaats. Hier zijn specifieke tips per regio om optimaal te drogen.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🌊</span>
                  <h3 className="text-xl font-bold text-gray-800">Kust (West-Vlaanderen)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Voordelen:</strong> Meer wind, minder extreme temperaturen</div>
                  <div><strong>Uitdagingen:</strong> Zilte zeelucht, hogere luchtvochtigheid</div>
                  <div className="text-blue-700"><strong>Tips:</strong></div>
                  <ul className="text-blue-700 ml-4 space-y-1">
                    <li>• Was regelmatig naspoelen bij zilte lucht</li>
                    <li>• Profiteer van de constante zeebries</li>
                    <li>• Knijpers spoelen door corrosie door zout</li>
                    <li>• Was sneller droog door wind, maar kan stijver aanvoelen</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🌲</span>
                  <h3 className="text-xl font-bold text-gray-800">Ardennen (Namen, Luxemburg)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Voordelen:</strong> Droge lucht, minder luchtvervuiling</div>
                  <div><strong>Uitdagingen:</strong> Koelere temperaturen, schaduwrijke locaties</div>
                  <div className="text-green-700"><strong>Tips:</strong></div>
                  <ul className="text-green-700 ml-4 space-y-1">
                    <li>• Zoek een open, zonnige plek op de helling</li>
                    <li>• Start vroeger op de dag door kortere zonneduur</li>
                    <li>• Profiteer van de heldere, droge berglucht</li>
                    <li>• Let op nachtvorst in voor- en najaar</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🌾</span>
                  <h3 className="text-xl font-bold text-gray-800">Vlaanderen (Antwerpen, Limburg)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Voordelen:</strong> Gemiddeld Belgisch klimaat, open vlakten</div>
                  <div><strong>Uitdagingen:</strong> Variabel weer, soms stilstand door bebouwing</div>
                  <div className="text-orange-700"><strong>Tips:</strong></div>
                  <ul className="text-orange-700 ml-4 space-y-1">
                    <li>• Gebruik onze calculator voor accurate voorspellingen</li>
                    <li>• Let extra op weersveranderingen</li>
                    <li>• Profiteer van de open landschappen voor wind</li>
                    <li>• Ideaal referentieklimaat voor droogtijden</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🏙️</span>
                  <h3 className="text-xl font-bold text-gray-800">Brussel & omgeving</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div><strong>Voordelen:</strong> Stedelijk warmte-eiland, beschutting</div>
                  <div><strong>Uitdagingen:</strong> Luchtvervuiling, minder wind, beperkte ruimte</div>
                  <div className="text-gray-700"><strong>Tips:</strong></div>
                  <ul className="text-gray-700 ml-4 space-y-1">
                    <li>• Profiteer van 2-3°C hogere temperaturen</li>
                    <li>• Was vaker spoelen door vervuiling</li>
                    <li>• Zoek winderige binnentuinen of dakterrassen</li>
                    <li>• Overweeg binnen drogen bij smog-alarmen</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-xl">
              <div className="text-sky-800">
                <strong>🎯 Algemene tip voor heel België:</strong> Het weer kan binnen een paar kilometer al flink verschillen. Lokale weervoorspellingen zijn betrouwbaarder dan landelijke. Gebruik onze tool met je specifieke stad voor de beste resultaten!
              </div>
            </div>
          </div>

          {/* Second FAQ section removed and merged into first FAQ section */}
        </div>
      </main>
    </>
  );
}

