'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  eventType: string;
  isPublished: boolean;
}

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventTypeColor = (eventType: string) => {
    const colors = {
      FUNDRAISER: 'bg-green-100 text-green-800',
      WORKSHOP: 'bg-blue-100 text-blue-800',
      NETWORKING: 'bg-purple-100 text-purple-800',
      COMMUNITY: 'bg-orange-100 text-orange-800',
      CONFERENCE: 'bg-red-100 text-red-800',
    };
    return colors[eventType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const publishedEvents = events.filter(event => event.isPublished);

  if (publishedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No events scheduled</h3>
        <p className="text-gray-600">Check back soon for upcoming events!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {publishedEvents.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getEventTypeColor(event.eventType)}>
                  {event.eventType.replace('_', ' ')}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold line-clamp-2">
                {event.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(event.startDateTime)}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime(event.startDateTime)}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}