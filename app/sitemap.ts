import { MetadataRoute } from 'next';
import { gemeentes } from './data/gemeentes';
import { guides } from './data/guides';

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
    {
      url: `${baseUrl}/gids`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/gids/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // All gemeente pages
  const gemeentePages: MetadataRoute.Sitemap = gemeentes.map((gemeente) => ({
    url: `${baseUrl}/${gemeente.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...guidePages, ...gemeentePages];
}
