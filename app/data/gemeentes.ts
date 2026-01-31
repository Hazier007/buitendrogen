// Belgische gemeentes met coördinaten voor OpenWeatherMap
// Focus op Vlaanderen + grote Belgische steden

export interface Gemeente {
  slug: string;
  name: string;
  province: string;
  lat: number;
  lon: number;
  population?: number;
}

export const gemeentes: Gemeente[] = [
  // Antwerpen Provincie
  { slug: 'antwerpen', name: 'Antwerpen', province: 'Antwerpen', lat: 51.2194, lon: 4.4025, population: 530000 },
  { slug: 'mechelen', name: 'Mechelen', province: 'Antwerpen', lat: 51.0259, lon: 4.4776, population: 86000 },
  { slug: 'turnhout', name: 'Turnhout', province: 'Antwerpen', lat: 51.3225, lon: 4.9447, population: 45000 },
  { slug: 'lier', name: 'Lier', province: 'Antwerpen', lat: 51.1311, lon: 4.5697, population: 36000 },
  { slug: 'herentals', name: 'Herentals', province: 'Antwerpen', lat: 51.1764, lon: 4.8336, population: 28000 },
  { slug: 'mol', name: 'Mol', province: 'Antwerpen', lat: 51.1894, lon: 5.1178, population: 37000 },
  { slug: 'geel', name: 'Geel', province: 'Antwerpen', lat: 51.1625, lon: 4.9897, population: 41000 },
  { slug: 'brasschaat', name: 'Brasschaat', province: 'Antwerpen', lat: 51.2922, lon: 4.4917, population: 38000 },
  { slug: 'schoten', name: 'Schoten', province: 'Antwerpen', lat: 51.2528, lon: 4.4958, population: 35000 },
  { slug: 'mortsel', name: 'Mortsel', province: 'Antwerpen', lat: 51.1656, lon: 4.4564, population: 26000 },
  { slug: 'boom', name: 'Boom', province: 'Antwerpen', lat: 51.0906, lon: 4.3692, population: 19000 },
  { slug: 'willebroek', name: 'Willebroek', province: 'Antwerpen', lat: 51.0647, lon: 4.3628, population: 27000 },
  
  // Oost-Vlaanderen
  { slug: 'gent', name: 'Gent', province: 'Oost-Vlaanderen', lat: 51.0543, lon: 3.7174, population: 265000 },
  { slug: 'aalst', name: 'Aalst', province: 'Oost-Vlaanderen', lat: 50.9369, lon: 4.0367, population: 87000 },
  { slug: 'sint-niklaas', name: 'Sint-Niklaas', province: 'Oost-Vlaanderen', lat: 51.1564, lon: 4.1431, population: 79000 },
  { slug: 'dendermonde', name: 'Dendermonde', province: 'Oost-Vlaanderen', lat: 51.0286, lon: 4.1014, population: 46000 },
  { slug: 'lokeren', name: 'Lokeren', province: 'Oost-Vlaanderen', lat: 51.1031, lon: 3.9903, population: 42000 },
  { slug: 'beveren', name: 'Beveren', province: 'Oost-Vlaanderen', lat: 51.2117, lon: 4.2542, population: 49000 },
  { slug: 'wetteren', name: 'Wetteren', province: 'Oost-Vlaanderen', lat: 51.0003, lon: 3.8828, population: 25000 },
  { slug: 'zele', name: 'Zele', province: 'Oost-Vlaanderen', lat: 51.0678, lon: 4.0403, population: 22000 },
  { slug: 'temse', name: 'Temse', province: 'Oost-Vlaanderen', lat: 51.1286, lon: 4.2147, population: 30000 },
  { slug: 'geraardsbergen', name: 'Geraardsbergen', province: 'Oost-Vlaanderen', lat: 50.7700, lon: 3.8800, population: 34000 },
  { slug: 'ronse', name: 'Ronse', province: 'Oost-Vlaanderen', lat: 50.7500, lon: 3.6000, population: 26000 },
  { slug: 'eeklo', name: 'Eeklo', province: 'Oost-Vlaanderen', lat: 51.1872, lon: 3.5567, population: 21000 },
  
  // West-Vlaanderen
  { slug: 'brugge', name: 'Brugge', province: 'West-Vlaanderen', lat: 51.2093, lon: 3.2247, population: 118000 },
  { slug: 'oostende', name: 'Oostende', province: 'West-Vlaanderen', lat: 51.2194, lon: 2.9264, population: 72000 },
  { slug: 'kortrijk', name: 'Kortrijk', province: 'West-Vlaanderen', lat: 50.8279, lon: 3.2648, population: 77000 },
  { slug: 'roeselare', name: 'Roeselare', province: 'West-Vlaanderen', lat: 50.9444, lon: 3.1247, population: 65000 },
  { slug: 'knokke-heist', name: 'Knokke-Heist', province: 'West-Vlaanderen', lat: 51.3475, lon: 3.2919, population: 34000 },
  { slug: 'blankenberge', name: 'Blankenberge', province: 'West-Vlaanderen', lat: 51.3131, lon: 3.1328, population: 20000 },
  { slug: 'ieper', name: 'Ieper', province: 'West-Vlaanderen', lat: 50.8514, lon: 2.8850, population: 35000 },
  { slug: 'waregem', name: 'Waregem', province: 'West-Vlaanderen', lat: 50.8889, lon: 3.4250, population: 38000 },
  { slug: 'izegem', name: 'Izegem', province: 'West-Vlaanderen', lat: 50.9139, lon: 3.2142, population: 28000 },
  { slug: 'torhout', name: 'Torhout', province: 'West-Vlaanderen', lat: 51.0667, lon: 3.1000, population: 21000 },
  { slug: 'menen', name: 'Menen', province: 'West-Vlaanderen', lat: 50.7944, lon: 3.1189, population: 33000 },
  { slug: 'veurne', name: 'Veurne', province: 'West-Vlaanderen', lat: 51.0722, lon: 2.6611, population: 12000 },
  { slug: 'de-panne', name: 'De Panne', province: 'West-Vlaanderen', lat: 51.1000, lon: 2.5833, population: 11000 },
  
  // Vlaams-Brabant
  { slug: 'leuven', name: 'Leuven', province: 'Vlaams-Brabant', lat: 50.8798, lon: 4.7005, population: 102000 },
  { slug: 'vilvoorde', name: 'Vilvoorde', province: 'Vlaams-Brabant', lat: 50.9278, lon: 4.4297, population: 45000 },
  { slug: 'halle', name: 'Halle', province: 'Vlaams-Brabant', lat: 50.7339, lon: 4.2369, population: 40000 },
  { slug: 'tienen', name: 'Tienen', province: 'Vlaams-Brabant', lat: 50.8072, lon: 4.9378, population: 35000 },
  { slug: 'aarschot', name: 'Aarschot', province: 'Vlaams-Brabant', lat: 50.9867, lon: 4.8283, population: 30000 },
  { slug: 'diest', name: 'Diest', province: 'Vlaams-Brabant', lat: 50.9894, lon: 5.0508, population: 24000 },
  { slug: 'zaventem', name: 'Zaventem', province: 'Vlaams-Brabant', lat: 50.8836, lon: 4.4689, population: 34000 },
  { slug: 'dilbeek', name: 'Dilbeek', province: 'Vlaams-Brabant', lat: 50.8500, lon: 4.2667, population: 43000 },
  { slug: 'grimbergen', name: 'Grimbergen', province: 'Vlaams-Brabant', lat: 50.9333, lon: 4.3667, population: 38000 },
  { slug: 'overijse', name: 'Overijse', province: 'Vlaams-Brabant', lat: 50.7744, lon: 4.5342, population: 26000 },
  
  // Limburg
  { slug: 'hasselt', name: 'Hasselt', province: 'Limburg', lat: 50.9311, lon: 5.3378, population: 78000 },
  { slug: 'genk', name: 'Genk', province: 'Limburg', lat: 50.9650, lon: 5.5003, population: 67000 },
  { slug: 'sint-truiden', name: 'Sint-Truiden', province: 'Limburg', lat: 50.8167, lon: 5.1833, population: 40000 },
  { slug: 'tongeren', name: 'Tongeren', province: 'Limburg', lat: 50.7808, lon: 5.4647, population: 31000 },
  { slug: 'beringen', name: 'Beringen', province: 'Limburg', lat: 51.0494, lon: 5.2256, population: 47000 },
  { slug: 'lommel', name: 'Lommel', province: 'Limburg', lat: 51.2333, lon: 5.3167, population: 35000 },
  { slug: 'maasmechelen', name: 'Maasmechelen', province: 'Limburg', lat: 50.9667, lon: 5.6833, population: 39000 },
  { slug: 'bilzen', name: 'Bilzen', province: 'Limburg', lat: 50.8667, lon: 5.5167, population: 33000 },
  { slug: 'heusden-zolder', name: 'Heusden-Zolder', province: 'Limburg', lat: 51.0333, lon: 5.2833, population: 33000 },
  { slug: 'maaseik', name: 'Maaseik', province: 'Limburg', lat: 51.1000, lon: 5.7833, population: 26000 },
  { slug: 'houthalen-helchteren', name: 'Houthalen-Helchteren', province: 'Limburg', lat: 51.0333, lon: 5.3667, population: 32000 },
  
  // Brussel (apart gewest)
  { slug: 'brussel', name: 'Brussel', province: 'Brussels Hoofdstedelijk Gewest', lat: 50.8503, lon: 4.3517, population: 185000 },
  { slug: 'schaarbeek', name: 'Schaarbeek', province: 'Brussels Hoofdstedelijk Gewest', lat: 50.8667, lon: 4.3833, population: 133000 },
  { slug: 'anderlecht', name: 'Anderlecht', province: 'Brussels Hoofdstedelijk Gewest', lat: 50.8333, lon: 4.3000, population: 120000 },
  { slug: 'molenbeek', name: 'Sint-Jans-Molenbeek', province: 'Brussels Hoofdstedelijk Gewest', lat: 50.8547, lon: 4.3297, population: 97000 },
  { slug: 'elsene', name: 'Elsene', province: 'Brussels Hoofdstedelijk Gewest', lat: 50.8333, lon: 4.3667, population: 87000 },
  { slug: 'ukkel', name: 'Ukkel', province: 'Brussels Hoofdstedelijk Gewest', lat: 50.8000, lon: 4.3333, population: 84000 },
];

export function getGemeenteBySlug(slug: string): Gemeente | undefined {
  return gemeentes.find(g => g.slug === slug);
}

export function getGemeentesByProvince(province: string): Gemeente[] {
  return gemeentes.filter(g => g.province === province);
}

export function getAllSlugs(): string[] {
  return gemeentes.map(g => g.slug);
}
