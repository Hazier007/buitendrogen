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

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Veelgestelde vragen</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Kan ik was buiten drogen in de winter?</h3>
                <p className="text-gray-600">
                  Ja, zelfs bij temperaturen rond of onder het vriespunt kan was buiten drogen. Dit gebeurt via sublimatie: het water in je kleding gaat rechtstreeks van ijs over naar waterdamp, zonder eerst vloeibaar te worden. Dit werkt het best bij droog winterweer met een lage luchtvochtigheid en wat wind. Het duurt wel aanzienlijk langer dan in de zomer — reken op een hele dag. Vermijd regenachtige of mistige winterdagen, want dan is de lucht al te vochtig om extra vocht op te nemen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Wat is beter: buiten drogen of de droger?</h3>
                <p className="text-gray-600">
                  Buiten drogen is vrijwel altijd de betere keuze als het weer het toelaat. Je bespaart gemiddeld 2 tot 4 kWh per droogbeurt, wat neerkomt op zo&apos;n €0,60 tot €1,20 per keer. Bovendien is buiten drogen veel zachter voor je kleding: vezels slijten minder, kleuren blijven langer mooi en elastiek behoudt zijn veerkracht. Een wasdroger is handig bij slecht weer, tijdsdruk of voor wie geen buitenruimte heeft, maar de slijtage aan kleding is merkbaar hoger.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Kan was te lang buiten hangen?</h3>
                <p className="text-gray-600">
                  Ja, langdurig buiten hangen kan nadelig zijn. Fel zonlicht bevat UV-straling die kleuren doet vervagen, vooral bij donkere of felgekleurde kledingstukken. Delicate stoffen zoals zijde of viscose kunnen bovendien bros worden door te lange blootstelling aan zon en wind. Als je was al droog is, haal ze dan zo snel mogelijk binnen. Hang gekleurde items bij voorkeur binnenstebuiten op of kies een plek in de halfschaduw om verkleuring te voorkomen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Waarom ruikt buiten gedroogde was zo lekker?</h3>
                <p className="text-gray-600">
                  Die heerlijke frisse geur van buitengedroogde was heeft een wetenschappelijke verklaring. UV-straling van de zon doodt bacteriën en schimmels die geurtjes veroorzaken. Daarnaast speelt ozon — een molecule die in kleine hoeveelheden in de buitenlucht aanwezig is — een rol als natuurlijk ontgeurringsmiddel. De combinatie van wind, zon en frisse lucht zorgt voor een geur die geen enkel wasverzachter kan evenaren. Dit effect is het sterkst op zonnige dagen met een lichte bries.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Bij welke temperatuur droogt was het snelst?</h3>
                <p className="text-gray-600">
                  Was droogt het snelst bij temperaturen boven 25°C in combinatie met een lage luchtvochtigheid. Warmere lucht kan namelijk meer vocht opnemen dan koude lucht, waardoor verdamping sneller gaat. Maar temperatuur alleen is niet allesbepalend: een dag van 15°C met droge lucht en stevige wind kan effectiever zijn dan een vochtige, windstille dag van 28°C. In België heb je de beste droogomstandigheden doorgaans van mei tot september, wanneer temperatuur en luchtvochtigheid samen het gunstigst zijn.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Hoelang duurt het om was buiten te drogen?</h3>
                <p className="text-gray-600">
                  De droogtijd varieert sterk afhankelijk van het weer en het type wasgoed. Op een warme zomerdag met zon en wind zijn dunne T-shirts en ondergoed al droog in 1 tot 2 uur. Normale was zoals katoenen kleding heeft gemiddeld 2 tot 4 uur nodig. Dikke items zoals handdoeken, jeans of hoodies kunnen 4 tot 8 uur duren. Op koelere of vochtigere dagen moet je rekenen op een halve tot een hele dag. Gebruik onze calculator hierboven voor een nauwkeurige schatting op basis van het actuele weer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Kan ik was buiten drogen als het bewolkt is?</h3>
                <p className="text-gray-600">
                  Absoluut. Bewolking vermindert de directe zonnestraling, maar was droogt ook prima zonder zon. Wind en lage luchtvochtigheid zijn eigenlijk belangrijker dan zonlicht voor het droogproces. Op een bewolkte dag met een frisse bries en droge lucht droogt je was nog altijd goed, al duurt het iets langer dan op een zonnige dag. In België zijn licht bewolkte dagen met wind ideaal — je kleding droogt én de kleuren vervagen minder door het ontbreken van felle UV-straling.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Wat doe ik als het begint te regenen terwijl mijn was buiten hangt?</h3>
                <p className="text-gray-600">
                  Als er een korte bui voorbijtrekt, is er niet meteen reden tot paniek. Een lichte regenbui maakt je was nat, maar zodra de zon doorbreekt en de wind aantrekt, droogt alles weer snel op. Bij langdurige of hevige regen haal je de was best zo snel mogelijk binnen. Een overkapping of veranda kan uitkomst bieden. Tip: check altijd de weersverwachting voordat je was buitenhangt en plan je wasbeurt rond een droog blok van minstens een paar uur.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Droogt donkere was sneller dan witte was?</h3>
                <p className="text-gray-600">
                  Donkere kleding absorbeert meer zonlicht en wordt daardoor warmer, wat de verdamping iets kan versnellen. Het verschil is in de praktijk echter klein — het type stof en de dikte van het materiaal hebben een veel grotere invloed dan de kleur. Een dunne witte katoenen T-shirt droogt sneller dan een dikke donkere hoodie. Let wel op: donkere was kan sneller verkleuren in de zon, dus hang ze bij voorkeur binnenstebuiten of in de halfschaduw.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Hoeveel energie bespaar je door buiten te drogen?</h3>
                <p className="text-gray-600">
                  Een gemiddelde wasdroger verbruikt tussen de 2 en 4,5 kWh per droogcyclus, afhankelijk van het type (condensdroger, warmtepomp of luchtafvoer). Bij een elektriciteitsprijs van circa €0,30 per kWh bespaar je al snel €0,60 tot €1,35 per beurt. Wie drie keer per week wast en buiten droogt in plaats van de droger te gebruiken, bespaart jaarlijks tot €200 op de energierekening. Bovendien vermijd je de CO₂-uitstoot van zo&apos;n 150 tot 350 kg per jaar — goed voor het milieu én je portemonnee.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Kan ik dekens en donsdekken buiten drogen?</h3>
                <p className="text-gray-600">
                  Ja, maar het vergt wat extra aandacht. Dekens en donsdekken zijn zwaar en dik, waardoor ze lang nodig hebben om volledig te drogen — reken op een volledige dag bij goed weer. Hang ze over een stevige waslijn of droogrek zodat er aan beide kanten lucht bij kan. Schud donsdekken regelmatig op tijdens het drogen om klontvorming te voorkomen. Kies een droge, zonnige dag met wind. Controleer voor je ze binnenbrengt of ze écht helemaal droog zijn, want restvocht kan schimmelvorming veroorzaken.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Wat is het beste moment van de dag om was buiten te hangen?</h3>
                <p className="text-gray-600">
                  Het ideale moment is &apos;s ochtends vroeg, tussen 8 en 10 uur. De luchtvochtigheid daalt naarmate de dag vordert en de temperatuur stijgt, waardoor je was het meeste profijt heeft van de droogste uren van de dag — doorgaans tussen 11 en 16 uur. Door &apos;s ochtends te starten, benut je het volledige droogvenster. Vermijd het om was &apos;s avonds laat buiten te hangen, want de luchtvochtigheid stijgt dan weer en je was kan dauwnat worden in de nacht.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Alles over buiten drogen in België</h2>
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
        </div>
      </main>
    </>
  );
}
