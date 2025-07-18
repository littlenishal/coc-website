'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

type Event = {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  eventType: string;
  imageUrl?: string;
  registrationUrl?: string;
}

export function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        const upcomingEvents = data
          .filter((event: Event) => {
            const eventDate = new Date(event.startDateTime);
            return eventDate > new Date();
          })
          .sort((a: Event, b: Event) => 
            new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
          )
          .slice(0, 4); // Limit to 4 upcoming events
        setEvents(upcomingEvents);
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
      <section className="container px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured Events</h2>
        <Button variant="outline" asChild>
          <Link href="/events">View All Events</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <div key={event.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <span className="text-sm text-muted-foreground">
              {formatDate(new Date(event.startDateTime))}
            </span>
            <h3 className="text-xl font-semibold mt-2">{event.title}</h3>
            <p className="text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
            <div className="pt-4 space-y-2">
                {event.registrationUrl && (
                  <Button asChild className="w-full">
                    <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                      Register Now
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/events/${event.id}`}>
                    Learn More
                  </Link>
                </Button>
              </div>
          </div>
        ))}
      </div>
    </section>
  );
}