
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ZeffyDonationButton } from './ZeffyDonationButton';

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

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p className="text-lg">No events are currently scheduled.</p>
        <p className="mt-2">Check back soon for upcoming events!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
          <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Event Date */}
              <div className="flex justify-end items-start">
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
                {event.registrationUrl && (
                  <div className="flex justify-center pt-2">
                    <ZeffyDonationButton 
                      registrationUrl={event.registrationUrl}
                      buttonText="Donate"
                      buttonColor="#28a745"
                      className="w-full min-w-0"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
}
