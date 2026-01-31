'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Gemeente, getGemeentesByProvince } from '../data/gemeentes';

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  clouds: number;
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

interface GemeenteClientProps {
  gemeente: Gemeente;
  initialWeather: WeatherData | null;
}

export default function GemeenteClient({ gemeente, initialWeather }: GemeenteClientProps) {
  const [weather, setWeather] = useState<WeatherData | null>(initialWeather);
  const [result, setResult] = useState<DryingResult | null>(null);
  const [wasType, setWasType] = useState<'normaal' | 'dik' | 'delicaat'>('normaal');
  const [loading, setLoading] = useState(!initialWeather);

  const nearbyGemeentes = getGemeentesByProvince(gemeente.province)
    .filter(g => g.slug !== gemeente.slug)
    .slice(0, 6);

  const calculateDryingTime = (weather: WeatherData, type: string): DryingResult => {
    let baseTime = 180;
    if (type === 'dik') baseTime = 300;
    if (type === 'delicaat') baseTime = 150;

    let tempScore = 0;
    if (weather.temp >= 25) tempScore = 100;
    else if (weather.temp >= 20) tempScore = 80;
    else if (weather.temp >= 15) tempScore = 60;
    else if (weather.temp >= 10) tempScore = 40;
    else if (weather.temp >= 5) tempScore = 20;
    else tempScore = 0;

    const tempMultiplier = 1 + ((50 - tempScore) / 100);

    let humidityScore = 0;
    if (weather.humidity <= 40) humidityScore = 100;
    else if (weather.humidity <= 50) humidityScore = 80;
    else if (weather.humidity <= 60) humidityScore = 60;
    else if (weather.humidity <= 70) humidityScore = 40;
    else if (weather.humidity <= 80) humidityScore = 20;
    else humidityScore = 0;

    const humidityMultiplier = 1 + ((100 - humidityScore) / 100);

    let windScore = 0;
    const windKmh = weather.windSpeed * 3.6;
    if (windKmh >= 20) windScore = 100;
    else if (windKmh >= 15) windScore = 80;
    else if (windKmh >= 10) windScore = 60;
    else if (windKmh >= 5) windScore = 40;
    else windScore = 20;

    const windMultiplier = 1 - (windScore / 200);

    let sunScore = 0;
    if (weather.clouds <= 20) sunScore = 100;
    else if (weather.clouds <= 40) sunScore = 80;
    else if (weather.clouds <= 60) sunScore = 60;
    else if (weather.clouds <= 80) sunScore = 40;
    else sunScore = 20;

    const sunMultiplier = 1 + ((100 - sunScore) / 200);

    let totalMinutes = baseTime * tempMultiplier * humidityMultiplier * windMultiplier * sunMultiplier;
    totalMinutes = Math.round(totalMinutes);

    const avgScore = (tempScore + humidityScore + windScore + sunScore) / 4;
    let rating: DryingResult['rating'];
    if (avgScore >= 80) rating = 'uitstekend';
    else if (avgScore >= 60) rating = 'goed';
    else if (avgScore >= 40) rating = 'matig';
    else if (avgScore >= 20) rating = 'slecht';
    else rating = 'ongeschikt';

    const tips: string[] = [];
    if (weather.humidity > 70) tips.push('Hoge luchtvochtigheid - overweeg binnen te drogen');
    if (weather.temp < 10) tips.push('Lage temperatuur - drogen duurt langer');
    if (windKmh < 5) tips.push('Weinig wind - hang was op een open plek');
    if (weather.clouds > 80) tips.push('Bewolkt - minder zonwarmte beschikbaar');
    if (avgScore >= 70) tips.push('Perfect wasweer! Hang je was gerust buiten');
    if (weather.temp > 25 && weather.humidity < 50) tips.push('Ideale condities voor snel drogen');

    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      rating,
      tips,
      factors: { tempScore, humidityScore, windScore, sunScore },
    };
  };

  useEffect(() => {
    if (weather) {
      setResult(calculateDryingTime(weather, wasType));
    }
  }, [weather, wasType]);

  useEffect(() => {
    if (!initialWeather) {
      fetchWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/weather?lat=${gemeente.lat}&lon=${gemeente.lon}`);
      const data = await response.json();
      if (response.ok) {
        setWeather(data);
      }
    } catch {
      // Silent fail - we'll show a message
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: DryingResult['rating']) => {
    switch (rating) {
      case 'uitstekend': return 'bg-green-500';
      case 'goed': return 'bg-green-400';
      case 'matig': return 'bg-yellow-500';
      case 'slecht': return 'bg-orange-500';
      case 'ongeschikt': return 'bg-red-500';
    }
  };

  const getRatingEmoji = (rating: DryingResult['rating']) => {
    switch (rating) {
      case 'uitstekend': return '☀️';
      case 'goed': return '🌤️';
      case 'matig': return '⛅';
      case 'slecht': return '🌥️';
      case 'ongeschikt': return '🌧️';
    }
  };

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Was buiten drogen in ${gemeente.name}`,
    description: `Bekijk de actuele droogomstandigheden in ${gemeente.name}. Bereken hoe lang je was buiten moet hangen.`,
    url: `https://buitendrogen.be/${gemeente.slug}`,
    mainEntity: {
      '@type': 'Service',
      name: 'Droogtijd Calculator',
      areaServed: {
        '@type': 'City',
        name: gemeente.name,
        containedInPlace: {
          '@type': 'State',
          name: gemeente.province,
        },
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-sky-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{gemeente.name}</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Was buiten drogen in {gemeente.name}
            </h1>
            <p className="text-lg text-gray-600">
              Bekijk de actuele droogomstandigheden in {gemeente.name}, {gemeente.province}
            </p>
          </div>

          {/* Weather & Result Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-4xl mb-4">🌀</div>
                <p className="text-gray-600">Weer ophalen voor {gemeente.name}...</p>
              </div>
            ) : weather && result ? (
              <div className="space-y-6">
                {/* Weather Grid */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h2 className="font-semibold text-gray-700 mb-3">Huidig weer in {gemeente.name}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl">🌡️</div>
                      <div className="text-xl font-bold">{weather.temp.toFixed(1)}°C</div>
                      <div className="text-sm text-gray-500">Temperatuur</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">💧</div>
                      <div className="text-xl font-bold">{weather.humidity}%</div>
                      <div className="text-sm text-gray-500">Luchtvochtigheid</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">💨</div>
                      <div className="text-xl font-bold">{(weather.windSpeed * 3.6).toFixed(0)} km/u</div>
                      <div className="text-sm text-gray-500">Wind</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">☁️</div>
                      <div className="text-xl font-bold">{weather.clouds}%</div>
                      <div className="text-sm text-gray-500">Bewolking</div>
                    </div>
                  </div>
                </div>

                {/* Clothing Type Selector */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">👕 Type wasgoed</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'normaal', label: 'Normaal', desc: 'T-shirts, ondergoed' },
                      { id: 'dik', label: 'Dik', desc: 'Handdoeken, jeans' },
                      { id: 'delicaat', label: 'Delicaat', desc: 'Fijne stoffen' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setWasType(type.id as typeof wasType)}
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

                {/* Main Result */}
                <div className={`p-6 rounded-xl text-white ${getRatingColor(result.rating)}`}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getRatingEmoji(result.rating)}</div>
                    <div className="text-lg opacity-90 mb-1">Geschatte droogtijd</div>
                    <div className="text-4xl font-bold mb-2">
                      {result.hours > 0 && `${result.hours} uur `}
                      {result.minutes > 0 && `${result.minutes} min`}
                    </div>
                    <div className="text-xl font-semibold capitalize">{result.rating}</div>
                  </div>
                </div>

                {/* Factor Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Temperatuur', score: result.factors.tempScore, icon: '🌡️' },
                    { label: 'Luchtvochtigheid', score: result.factors.humidityScore, icon: '💧' },
                    { label: 'Wind', score: result.factors.windScore, icon: '💨' },
                    { label: 'Zon', score: result.factors.sunScore, icon: '☀️' },
                  ].map((factor) => (
                    <div key={factor.label} className="bg-gray-50 p-3 rounded-xl text-center">
                      <div className="text-xl">{factor.icon}</div>
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

                {/* Tips */}
                {result.tips.length > 0 && (
                  <div className="bg-sky-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-sky-800 mb-2">💡 Tips voor {gemeente.name}</h3>
                    <ul className="space-y-1">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="text-sky-700">• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Kon het weer niet ophalen. Probeer het later opnieuw.</p>
                <button
                  onClick={fetchWeather}
                  className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600"
                >
                  Opnieuw proberen
                </button>
              </div>
            )}
          </div>

          {/* Local SEO Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Wasweer in {gemeente.name}
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                Woon je in <strong>{gemeente.name}</strong> en vraag je je af of je vandaag je was buiten kunt hangen?
                Met onze droogtijd calculator zie je direct of de weersomstandigheden in {gemeente.name} geschikt zijn
                om je was buiten te drogen.
              </p>
              <p className="text-gray-600 mb-4">
                Het weer in {gemeente.province} kan wisselvallig zijn. Daarom is het handig om voor je de was
                buiten hangt even te checken hoe de temperatuur, luchtvochtigheid en wind ervoor staan in {gemeente.name}.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                Wanneer was buiten drogen in {gemeente.name}?
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>✓ <strong>Temperatuur:</strong> Ideaal boven 15°C, maar ook bij koudere temperaturen droogt was buiten</li>
                <li>✓ <strong>Luchtvochtigheid:</strong> Hoe lager hoe beter - onder 60% is ideaal</li>
                <li>✓ <strong>Wind:</strong> Een briesje helpt enorm bij het drogen</li>
                <li>✓ <strong>Zon:</strong> Zonnestraling versnelt het droogproces aanzienlijk</li>
              </ul>
            </div>
          </div>

          {/* Nearby Locations */}
          {nearbyGemeentes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Wasweer in de buurt van {gemeente.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {nearbyGemeentes.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/${g.slug}`}
                    className="p-3 bg-gray-50 rounded-xl hover:bg-sky-50 hover:border-sky-200 border border-transparent transition-colors"
                  >
                    <span className="font-medium text-gray-800">{g.name}</span>
                    <span className="text-sm text-gray-500 block">{g.province}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors"
            >
              ← Terug naar home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
