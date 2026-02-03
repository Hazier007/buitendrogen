'use client';

import { useState } from 'react';
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
              <div className="flex gap-3">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
                  placeholder="Bijv. Gent, Antwerpen, Brussel..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none text-lg"
                />
                <button
                  onClick={fetchWeather}
                  disabled={loading}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
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

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hoe werkt de berekening?</h2>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tips voor sneller buiten drogen</h2>
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

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Veelgestelde vragen</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Kan ik was buiten drogen in de winter?</h3>
                <p className="text-gray-600">
                  Ja, zelfs bij temperaturen rond het vriespunt kan was buiten drogen dankzij sublimatie. Het duurt wel
                  langer en werkt best bij droog winterweer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Wat is beter: buiten drogen of de droger?</h3>
                <p className="text-gray-600">
                  Buiten drogen is energiezuiniger, zachter voor je kleding en milieuvriendelijker. Een droger is handig
                  bij slecht weer of weinig tijd.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Kan was te lang buiten hangen?</h3>
                <p className="text-gray-600">
                  Langdurige blootstelling aan fel zonlicht kan kleuren doen vervagen. Delicate of gekleurde items kun je
                  beter in de schaduw hangen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Waarom ruikt buiten gedroogde was zo lekker?</h3>
                <p className="text-gray-600">
                  UV-straling van de zon doodt bacteriën en ozon in de buitenlucht geeft een frisse geur. Daarom ruikt
                  buiten gedroogde was zo lekker.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
