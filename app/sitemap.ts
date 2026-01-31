import { MetadataRoute } from 'next';
import { gemeentes } from './data/gemeentes';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://buitendrogen.be';

  // Homepage
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/over-mij`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // All gemeente pages
  const gemeentePages: MetadataRoute.Sitemap = gemeentes.map((gemeente) => ({
    url: `${baseUrl}/${gemeente.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...gemeentePages];
}
