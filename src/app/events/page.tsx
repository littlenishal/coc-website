
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar as CalendarIcon, List, ChevronLeft, Filter } from "lucide-react";
import { Calendar } from "@/components/Calendar";
import { EventList } from "@/components/EventList";
import { EventModal } from "@/components/EventModal";
import { EventFilters } from "@/components/EventFilters";

type Event = {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  eventType: string;
  isPublished: boolean;
};

export default function EventsPage() {
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        const publishedEvents = data.filter((event: Event) => event.isPublished);
        setEvents(publishedEvents);
        setFilteredEvents(publishedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Check URL parameters on load to show filters if any exist
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasFilters = urlParams.has('search') || urlParams.has('types') || 
                      (urlParams.has('date') && urlParams.get('date') !== 'upcoming') ||
                      urlParams.has('start_date') || urlParams.has('end_date');
    
    if (hasFilters) {
      setShowFilters(true);
    }
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-foreground font-medium">Events</span>
          </nav>
        </div>
      </div>

      {/* Header with Title and Controls */}
      <div className="container px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Discover upcoming events and activities in our community
            </p>
          </div>
          
          {/* Controls: Filter Toggle and View Toggle Buttons */}
          <div className="flex gap-2">
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              variant={currentView === 'calendar' ? 'default' : 'outline'}
              onClick={() => setCurrentView('calendar')}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'outline'}
              onClick={() => setCurrentView('list')}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <List className="h-4 w-4" />
              List View
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container px-4 pb-8">
        <div className={`grid gap-6 ${showFilters ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {/* Conditional Sidebar with Filters */}
          {showFilters && (
            <div className="lg:col-span-1">
              {!isLoading && (
                <EventFilters
                  events={events}
                  onFilteredEventsChange={setFilteredEvents}
                  onFiltersCleared={() => setShowFilters(false)}
                  className="sticky top-6"
                />
              )}
            </div>
          )}

          {/* Main Calendar/List Component */}
          <div className={showFilters ? 'lg:col-span-3' : 'col-span-1'}>
            <div className="border rounded-lg bg-card">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading events...</p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {currentView === 'calendar' ? (
                    <Calendar 
                      events={filteredEvents} 
                      onEventClick={handleEventClick}
                    />
                  ) : (
                    <EventList 
                      events={filteredEvents} 
                      onEventClick={handleEventClick}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
