
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Share2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Event = {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  eventType: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string>('');

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setEventId(resolvedParams.id);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }
        const eventData = await response.json();
        setEvent(eventData);

        // Update document title and meta tags for SEO
        document.title = `${eventData.title} | Captains of Commerce Arlington`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', 
            eventData.description.substring(0, 160) + (eventData.description.length > 160 ? '...' : '')
          );
        }

        // Add structured data for SEO
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": eventData.title,
          "description": eventData.description,
          "startDate": eventData.startDateTime,
          "endDate": eventData.endDateTime,
          "location": {
            "@type": "Place",
            "name": eventData.location,
            "address": eventData.location
          },
          "organizer": {
            "@type": "Organization",
            "name": "Captains of Commerce Arlington",
            "url": window.location.origin
          },
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
        };

        // Add or update structured data script
        let structuredDataScript = document.getElementById('event-structured-data') as HTMLScriptElement;
        if (!structuredDataScript) {
          structuredDataScript = document.createElement('script') as HTMLScriptElement;
          structuredDataScript.id = 'event-structured-data';
          structuredDataScript.type = 'application/ld+json';
          document.head.appendChild(structuredDataScript);
        }
        structuredDataScript.textContent = JSON.stringify(structuredData);

        // Add Open Graph meta tags
        const updateOrCreateMetaTag = (property: string, content: string) => {
          let metaTag = document.querySelector(`meta[property="${property}"]`);
          if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('property', property);
            document.head.appendChild(metaTag);
          }
          metaTag.setAttribute('content', content);
        };

        updateOrCreateMetaTag('og:title', eventData.title);
        updateOrCreateMetaTag('og:description', eventData.description.substring(0, 300));
        updateOrCreateMetaTag('og:type', 'event');
        updateOrCreateMetaTag('og:url', window.location.href);
        if (eventData.imageUrl) {
          updateOrCreateMetaTag('og:image', eventData.imageUrl);
        }

      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

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

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fundraiser':
        return 'bg-green-100 text-green-800';
      case 'networking':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-purple-100 text-purple-800';
      case 'social':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const shareEvent = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to copying URL to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mb-8"></div>
              <div className="h-64 bg-muted rounded-lg mb-8"></div>
              <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The event you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/events">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
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
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/events">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>

          {/* Event Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <Badge className={cn("mb-4", getEventTypeColor(event.eventType))}>
                  {event.eventType}
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  {event.title}
                </h1>
              </div>
              <Button variant="outline" size="sm" onClick={shareEvent}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
            </div>

            {/* Event Image */}
            {event.imageUrl && (
              <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </Card>
            </div>

            {/* Event Details Sidebar */}
            <div className="space-y-6">
              {/* Date & Time */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                  Date & Time
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{formatDate(event.startDateTime)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Location */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                  Location
                </h3>
                <p className="text-muted-foreground">{event.location}</p>
              </Card>

              {/* Event Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Event Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                    <p className="capitalize">{event.eventType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-green-600">Open Event</p>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Questions?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Contact us for more information about this event.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="mailto:info@captainsofcommerce.org">
                      Email Us
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/events">
                      View More Events
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
