
'use client';

import { useState, useEffect } from 'react';
import { EventList } from '@/components/EventList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';

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
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function EventsClientPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const eventsData = await response.json();
        
        // Filter for published events and sort by start date
        const publishedEvents = eventsData
          .filter((event: Event) => event.isPublished)
          .sort((a: Event, b: Event) => 
            new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
          );
        
        setEvents(publishedEvents);
        setFilteredEvents(publishedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchTerm, events]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-muted rounded w-1/3 mb-8"></div>
              <div className="h-10 bg-muted rounded w-full mb-8"></div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Unable to Load Events</h1>
            <p className="text-muted-foreground mb-8">
              {error}. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-primary" />
              Events
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover upcoming community events and connect with fellow members.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'No events found' : 'No upcoming events'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms.'
                  : 'Check back soon for new events.'
                }
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <EventList events={filteredEvents} />
          )}
        </div>
      </div>
    </div>
  );
}
