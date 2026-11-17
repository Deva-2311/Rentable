import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/owner/', '/borrower/', '/admin/'], // Protect private dashboards
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
