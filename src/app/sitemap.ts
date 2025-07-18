
import { MetadataRoute } from 'next'

type Event = {
  id: string;
  isPublished: boolean;
  updatedAt: string;
};

async function getEvents(): Promise<Event[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/events`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const events = await response.json();
    return events.filter((event: Event) => event.isPublished);
  } catch (error) {
    console.error('Error fetching events for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://captainsofcommerce.org';
  const events = await getEvents();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // Dynamic event pages
  const eventPages = events.map((event: Event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: new Date(event.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...eventPages];
}
