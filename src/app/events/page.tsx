
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar as CalendarIcon, List, ChevronLeft } from "lucide-react";
import { Calendar } from "@/components/Calendar";
import { EventModal } from "@/components/EventModal";

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
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.filter((event: Event) => event.isPublished));
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
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
    <div className="flex flex-col items-center justify-center gap-16">
      {/* Breadcrumb Navigation */}
      <section className="w-full border-b bg-muted/30">
        <div className="container px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-foreground font-medium">Events</span>
          </nav>
        </div>
      </section>

      {/* Page Header */}
      <section className="w-full">
        <div className="container px-4">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="text-center sm:text-left">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Event Calendar</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Discover upcoming events and activities in our community
                </p>
              </div>
              
              {/* View Toggle Tabs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
                <Button
                  variant={currentView === 'calendar' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('calendar')}
                  className="flex items-center gap-2"
                  disabled={isLoading}
                  size="lg"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Calendar View
                </Button>
                <Button
                  variant={currentView === 'list' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('list')}
                  className="flex items-center gap-2"
                  disabled={isLoading}
                  size="lg"
                >
                  <List className="h-4 w-4" />
                  List View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="w-full">
        <div className="container px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground text-lg">Loading events...</p>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border p-8 shadow-sm">
              {currentView === 'calendar' ? (
                <Calendar 
                  events={events} 
                  onEventClick={handleEventClick}
                />
              ) : (
                <div className="text-center py-16 space-y-6">
                  <List className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-medium">List View</h3>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                      Event list component will be implemented here to show events in a structured format
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Event Details Modal */}
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
