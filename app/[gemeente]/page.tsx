import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { gemeentes, getGemeenteBySlug, type Gemeente } from '../data/gemeentes';
import GemeenteClient from './GemeenteClient';

interface PageProps {
  params: Promise<{ gemeente: string }>;
}

export async function generateStaticParams() {
  return gemeentes.map((gemeente) => ({ gemeente: gemeente.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gemeente: slug } = await params;
  const gemeente = getGemeenteBySlug(slug);

  if (!gemeente) {
    return { title: 'Gemeente niet gevonden | Buitendrogen.be' };
  }

  const title = `Was buiten drogen in ${gemeente.name} - Droogtijd berekenen | Buitendrogen.be`;
  const description = `Bekijk de actuele droogomstandigheden in ${gemeente.name}, ${gemeente.province}. Bereken hoe lang je was buiten moet hangen. Check temperatuur, wind en luchtvochtigheid voor perfect wasweer.`;

  return {
    title,
    description,
    keywords: [
      `was drogen ${gemeente.name}`,
      `wasweer ${gemeente.name}`,
      `buiten drogen ${gemeente.name}`,
      `droogtijd ${gemeente.name}`,
      `${gemeente.name} weer`,
      'was buiten hangen',
      'droogweer',
      'wasdroger alternatief',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'nl_BE',
      siteName: 'Buitendrogen.be',
    },
    alternates: {
      canonical: `https://buitendrogen.be/${gemeente.slug}`,
    },
  };
}

async function getWeatherData(gemeente: Gemeente) {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) return null;

  try {
    // Cache for 30 minutes
const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${gemeente.lat}&lon=${gemeente.lon}&units=metric&lang=nl&appid=${apiKey}`,
      { next: { revalidate: 1800 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return {
      temp: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      clouds: data.clouds.all,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch {
    return null;
  }
}

export default async function GemeentePage({ params }: PageProps) {
  const { gemeente: slug } = await params;
  const gemeente = getGemeenteBySlug(slug);
  if (!gemeente) notFound();

  const weatherData = await getWeatherData(gemeente);
  return <GemeenteClient gemeente={gemeente} initialWeather={weatherData} />;
}
