
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar as CalendarIcon, List, ChevronLeft } from "lucide-react";
import { Calendar } from "@/components/Calendar";
import { EventList } from "@/components/EventList";
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
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('list');
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

      {/* Header with Title and View Toggle */}
      <div className="container px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Discover upcoming events and activities in our community
            </p>
          </div>
          
          {/* View Toggle Buttons */}
          <div className="flex gap-2">
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

      {/* Main Calendar Component Area */}
      <div className="container px-4 pb-8">
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
                  events={events} 
                  onEventClick={handleEventClick}
                />
              ) : (
                <EventList 
                  events={events} 
                  onEventClick={handleEventClick}
                />
              )}
            </div>
          )}
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
