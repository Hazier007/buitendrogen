'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { type Gemeente, getGemeentesByProvince } from '../data/gemeentes';

type WeatherData = {
  temp: number;
  humidity: number;
  windSpeed: number;
  clouds: number;
  description: string;
  icon: string;
};

type DryingRating = 'uitstekend' | 'goed' | 'matig' | 'slecht' | 'ongeschikt';

type DryingResult = {
  hours: number;
  minutes: number;
  rating: DryingRating;
  tips: string[];
};

type Props = {
  gemeente: Gemeente;
  initialWeather: WeatherData | null;
};

function calc(weather: WeatherData, wasType: 'normaal' | 'dik' | 'delicaat'): DryingResult {
  let baseMinutes = 180;
  if (wasType === 'dik') baseMinutes = 300;
  if (wasType === 'delicaat') baseMinutes = 150;

  const windKmh = weather.windSpeed * 3.6;

  const tempScore = weather.temp >= 25 ? 100 : weather.temp >= 20 ? 80 : weather.temp >= 15 ? 60 : weather.temp >= 10 ? 40 : weather.temp >= 5 ? 20 : 0;
  const humidityScore = weather.humidity <= 40 ? 100 : weather.humidity <= 50 ? 80 : weather.humidity <= 60 ? 60 : weather.humidity <= 70 ? 40 : weather.humidity <= 80 ? 20 : 0;
  const windScore = windKmh >= 20 ? 100 : windKmh >= 15 ? 80 : windKmh >= 10 ? 60 : windKmh >= 5 ? 40 : 20;
  const sunScore = weather.clouds <= 20 ? 100 : weather.clouds <= 40 ? 80 : weather.clouds <= 60 ? 60 : weather.clouds <= 80 ? 40 : 20;

  const avg = (tempScore + humidityScore + windScore + sunScore) / 4;

  let rating: DryingRating;
  if (avg >= 80) rating = 'uitstekend';
  else if (avg >= 60) rating = 'goed';
  else if (avg >= 40) rating = 'matig';
  else if (avg >= 20) rating = 'slecht';
  else rating = 'ongeschikt';

  const tempMultiplier = 1 + (50 - tempScore) / 100;
  const humidityMultiplier = 1 + (100 - humidityScore) / 100;
  const windMultiplier = 1 - windScore / 200;
  const sunMultiplier = 1 + (100 - sunScore) / 200;

  const totalMinutes = Math.max(15, Math.round(baseMinutes * tempMultiplier * humidityMultiplier * windMultiplier * sunMultiplier));

  const tips: string[] = [];
  if (weather.humidity > 70) tips.push('Hoge luchtvochtigheid: drogen duurt langer.');
  if (weather.temp < 10) tips.push('Lage temperatuur: reken extra droogtijd.');
  if (windKmh < 5) tips.push('Weinig wind: hang de was op een open plek.');
  if (weather.clouds > 80) tips.push('Veel bewolking: minder zonwarmte.');

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    rating,
    tips,
  };
}

export default function GemeenteClient({ gemeente, initialWeather }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(initialWeather);
  const [loading, setLoading] = useState(!initialWeather);
  const [wasType, setWasType] = useState<'normaal' | 'dik' | 'delicaat'>('normaal');

  const result = useMemo(() => (weather ? calc(weather, wasType) : null), [weather, wasType]);

  const nearby = useMemo(() => {
    return getGemeentesByProvince(gemeente.province)
      .filter((g) => g.slug !== gemeente.slug)
      .slice(0, 6);
  }, [gemeente.province, gemeente.slug]);

  const localGuides = [
    {
      href: "/gids/was-buiten-drogen-bij-hoge-luchtvochtigheid",
      label: "Luchtvochtigheid gids",
      summary: "Wat te doen op vochtige dagen",
    },
    {
      href: "/gids/was-buiten-drogen-15-graden",
      label: "15 graden gids",
      summary: "Realistische droogtijden",
    },
    {
      href: "/gids/beste-moment-om-was-buiten-te-hangen",
      label: "Timing gids",
      summary: "Beste moment om op te hangen",
    },
  ];

  useEffect(() => {
    if (initialWeather) return;

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?lat=${gemeente.lat}&lon=${gemeente.lon}`);
        const data = await res.json();
        if (res.ok) setWeather(data);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [gemeente.lat, gemeente.lon, initialWeather]);

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
            <span className="text-gray-800">{gemeente.name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Was buiten drogen in {gemeente.name}</h1>
          <p className="mt-2 text-gray-600">Actuele omstandigheden voor {gemeente.name}, {gemeente.province}.</p>

          <div className="mt-6 rounded-2xl bg-white shadow p-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Type wasgoed:</span>
              {(['normaal', 'dik', 'delicaat'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setWasType(t)}
                  className={`px-3 py-1.5 rounded-xl border text-sm ${wasType === t ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {loading && <p className="mt-6 text-gray-600">Weer ophalen…</p>}

            {!loading && weather && result && (
              <div className="mt-6 grid gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat label="Temperatuur" value={`${weather.temp.toFixed(1)}°C`} />
                  <Stat label="Luchtvochtigheid" value={`${weather.humidity}%`} />
                  <Stat label="Wind" value={`${(weather.windSpeed * 3.6).toFixed(0)} km/u`} />
                  <Stat label="Bewolking" value={`${weather.clouds}%`} />
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Geschatte droogtijd</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {result.hours > 0 ? `${result.hours}u ` : ''}
                    {result.minutes}m
                  </p>
                  <p className="mt-1 text-sm text-gray-700">Score: {result.rating}</p>

                  {result.tips.length > 0 && (
                    <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
                      {result.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {!loading && !weather && <p className="mt-6 text-gray-600">Kon het weer niet ophalen. Probeer later opnieuw.</p>}
          </div>

          <div className="mt-8 rounded-2xl bg-white shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900">Meer weten over buiten drogen</h2>
            <p className="mt-2 text-sm text-gray-600">
              Verdiep je in praktische scenario&apos;s en plan je wasmoment beter met deze gidsen.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {localGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="rounded-xl border border-gray-200 p-4 hover:border-sky-300 hover:bg-sky-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{guide.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{guide.summary}</div>
                </Link>
              ))}
            </div>
          </div>

          {nearby.length > 0 && (
            <div className="mt-8 rounded-2xl bg-white shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900">In de buurt</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {nearby.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/${g.slug}`}
                    className="p-3 rounded-xl bg-gray-50 hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{g.name}</div>
                    <div className="text-sm text-gray-600">{g.province}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/" className="inline-block px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600">
              Terug naar home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 p-3 text-center">
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}
