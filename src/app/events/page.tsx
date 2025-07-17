
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

type Event = {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  eventType: string;
  isPublished: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        const publishedEvents = data
          .filter((event: Event) => event.isPublished)
          .sort((a: Event, b: Event) => 
            new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
          );
        setEvents(publishedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Events</h1>
        <div className="grid gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Events</h1>
      
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No events available at this time.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(new Date(event.startDateTime))}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {event.eventType}
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                    <p className="text-sm text-muted-foreground">
                      📍 {event.location}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                      Learn More
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
