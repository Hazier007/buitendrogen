import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHERMAP_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Weather API not configured' }, { status: 500 });
  }

  // Need either city OR lat+lon
  if (!city && (!lat || !lon)) {
    return NextResponse.json({ error: 'City or lat/lon is required' }, { status: 400 });
  }

  try {
    let latitude: number;
    let longitude: number;

    if (lat && lon) {
      // Direct coordinates provided
      latitude = parseFloat(lat);
      longitude = parseFloat(lon);
    } else {
      // Get coordinates from city name
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city!)},BE&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        // Try without country code
        const geoUrl2 = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city!)}&limit=1&appid=${apiKey}`;
        const geoResponse2 = await fetch(geoUrl2);
        const geoData2 = await geoResponse2.json();
        
        if (!geoData2 || geoData2.length === 0) {
          return NextResponse.json({ error: 'Locatie niet gevonden' }, { status: 404 });
        }
        
        geoData.push(geoData2[0]);
      }

      latitude = geoData[0].lat;
      longitude = geoData[0].lon;
    }

    // Get current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=nl&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      return NextResponse.json({ error: 'Kon weer niet ophalen' }, { status: 500 });
    }

    return NextResponse.json({
      temp: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      clouds: weatherData.clouds.all,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: 'Er ging iets mis met de weer API' }, { status: 500 });
  }
}
