
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Event = {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  eventType: string;
  registrationUrl?: string;
  isPublished: boolean;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        
        // Filter for published events only and sort by start date
        const publishedEvents = data
          .filter((event: Event) => event.isPublished)
          .sort((a: Event, b: Event) => 
            new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
          );
        
        setEvents(publishedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 h-64 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No events are currently scheduled.</p>
          <p className="mt-2">Check back soon for upcoming events!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Event Type Badge */}
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="text-xs">
                  {event.eventType.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(new Date(event.startDateTime))}
                </span>
              </div>

              {/* Event Title and Description */}
              <div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {event.description}
                </p>
              </div>

              {/* Event Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(event.startDateTime).toLocaleDateString()} at{' '}
                    {new Date(event.startDateTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {event.registrationUrl && (
                  <Button asChild className="w-full">
                    <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                      Register for Event
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/events/${event.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
