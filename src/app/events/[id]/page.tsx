
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ChevronLeft } from "lucide-react";

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ShareButton } from "@/components/ShareButton";

// Generate static params for published events at build time
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/events`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const events = await response.json();
    const publishedEvents = events.filter((event: Event) => event.isPublished);
    
    return publishedEvents.map((event: Event) => ({
      id: event.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

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

async function getEvent(id: string): Promise<Event | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/events/${id}`, {
      cache: 'no-store', // Ensure fresh data for each request
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const event = await getEvent(resolvedParams.id);

  if (!event) {
    return {
      title: 'Event Not Found | Captains of Commerce Arlington',
      description: 'The requested event could not be found.',
    };
  }

  const eventDate = new Date(event.startDateTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    title: `${event.title} | Captains of Commerce Arlington`,
    description: event.description.substring(0, 160) + (event.description.length > 160 ? '...' : ''),
    keywords: `${event.title}, ${event.eventType}, Arlington events, community events, ${eventDate}`,
    authors: [{ name: 'Captains of Commerce Arlington' }],
    openGraph: {
      title: event.title,
      description: event.description.substring(0, 300),
      type: 'article',
      publishedTime: event.createdAt,
      modifiedTime: event.updatedAt,
      url: `https://captainsofcommerce.org/events/${event.id}`,
      siteName: 'Captains of Commerce Arlington',
      images: event.imageUrl ? [
        {
          url: event.imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description.substring(0, 200),
      images: event.imageUrl ? [event.imageUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://captainsofcommerce.org/events/${event.id}`,
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = await getEvent(resolvedParams.id);

  if (!event) {
    notFound();
  }

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

  

  // JSON-LD structured data for the event
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.startDateTime,
    "endDate": event.endDateTime,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": event.location
    },
    "organizer": {
      "@type": "Organization",
      "name": "Captains of Commerce Arlington",
      "url": "https://captainsofcommerce.org"
    },
    "image": event.imageUrl || "https://captainsofcommerce.org/logo.png",
    "url": `https://captainsofcommerce.org/events/${event.id}`,
    "offers": event.registrationUrl ? {
      "@type": "Offer",
      "url": event.registrationUrl,
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    } : undefined
  };

  return (
    <>
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
                  <h1 className="text-4xl font-bold tracking-tight mb-4">
                    {event.title}
                  </h1>
                </div>
                <ShareButton 
                  title={event.title}
                  description={event.description}
                />
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

            {/* Main Content */}
            <div className="mb-8">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </Card>
            </div>

            {/* Event Details Grid - Responsive Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-green-600">Open Event</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Registration and Contact - Bottom Section */}
            {(event.registrationUrl || true) && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Registration */}
                {event.registrationUrl && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Register for Event</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Click below to register for this event.
                    </p>
                    <Button className="w-full" asChild>
                      <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                        Register Now
                      </a>
                    </Button>
                  </Card>
                )}

                {/* Contact Information */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Questions?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Contact us for more information about this event.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="mailto:hello@captainsofcommerce.org">
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
            )}
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </>
  );
}
