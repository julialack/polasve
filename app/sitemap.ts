import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://polasve.se'

  const routes = [
    '',
    '/annonser',
    '/nyheter',
    '/evenemang',
    '/om-oss',
    '/jobb',
    '/bostad',
    '/tjanster',
    '/transport',
    '/tips',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
