'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Share2, ChevronLeft, MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateCalendarLink, downloadICSFile } from "@/lib/calendar";

type Event = {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  address: string;
  imageUrl?: string;
  maxCapacity?: number;
  eventType: string;
  isPublished: boolean;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  registrations?: Array<{
    id: string;
    userId: string;
    status: string;
  }>;
  comments?: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }>;
};

const getTimezoneFromLocation = (location: string): string => {
  const locationLower = location.toLowerCase();

  if (locationLower.includes('arlington') || locationLower.includes('virginia') || 
      locationLower.includes('va') || locationLower.includes('washington dc') ||
      locationLower.includes('new york') || locationLower.includes('ny') ||
      locationLower.includes('florida') || locationLower.includes('fl') ||
      locationLower.includes('georgia') || locationLower.includes('ga') ||
      locationLower.includes('north carolina') || locationLower.includes('nc') ||
      locationLower.includes('south carolina') || locationLower.includes('sc')) {
    return 'America/New_York';
  }

  if (locationLower.includes('chicago') || locationLower.includes('illinois') ||
      locationLower.includes('il') || locationLower.includes('texas') ||
      locationLower.includes('tx') || locationLower.includes('minnesota') ||
      locationLower.includes('mn') || locationLower.includes('wisconsin') ||
      locationLower.includes('wi') || locationLower.includes('iowa') ||
      locationLower.includes('missouri') || locationLower.includes('mo')) {
    return 'America/Chicago';
  }

  if (locationLower.includes('denver') || locationLower.includes('colorado') ||
      locationLower.includes('co') || locationLower.includes('utah') ||
      locationLower.includes('ut') || locationLower.includes('arizona') ||
      locationLower.includes('az') || locationLower.includes('new mexico') ||
      locationLower.includes('nm')) {
    return 'America/Denver';
  }

  if (locationLower.includes('california') || locationLower.includes('ca') ||
      locationLower.includes('los angeles') || locationLower.includes('san francisco') ||
      locationLower.includes('seattle') || locationLower.includes('washington') ||
      locationLower.includes('wa') || locationLower.includes('oregon') ||
      locationLower.includes('or')) {
    return 'America/Los_Angeles';
  }

  return 'America/New_York';
};

const formatEventDateTime = (dateTime: string, location: string): string => {
  const timezone = getTimezoneFromLocation(location);
  const date = new Date(dateTime);

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short'
  }).format(date);
};

const getEventTypeLabel = (eventType: string): string => {
  switch (eventType) {
    case 'TOY_DRIVE':
      return 'Toy Drive';
    case 'FOOD_DRIVE':
      return 'Food Drive';
    case 'FUNDRAISER':
      return 'Fundraiser';
    default:
      return 'Event';
  }
};

const getEventTypeColor = (eventType: string): string => {
  switch (eventType) {
    case 'TOY_DRIVE':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'FOOD_DRIVE':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'FUNDRAISER':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { user, isLoading: userLoading } = useUser();

  const fetchEvent = useCallback(async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      const eventData = await response.json();
      setEvent(eventData);

      // Check if user is registered
      if (user && eventData.registrations) {
        const userRegistration = eventData.registrations.find(
          (reg: { userId: string; status: string }) => reg.userId === user.sub && reg.status === 'REGISTERED'
        );
        setIsRegistered(!!userRegistration);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      await fetchEvent(resolvedParams.id);
    }
    resolveParams();
  }, [params, fetchEvent]);

  const handleRegister = async () => {
    if (!user || !event) return;

    setIsRegistering(true);
    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsRegistered(true);
        // Refresh event data to get updated registration count
        await fetchEvent(event.id);
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !event) return;

    setIsRegistering(true);
    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsRegistered(false);
        // Refresh event data to get updated registration count
        await fetchEvent(event.id);
      } else {
        console.error('Unregistration failed');
      }
    } catch (error) {
      console.error('Error unregistering from event:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !event || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/events/${event.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (response.ok) {
        setNewComment('');
        // Refresh event data to get updated comments
        await fetchEvent(event.id);
      } else {
        console.error('Comment submission failed');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const copyEventUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    // Could add toast notification here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error || 'Event not found'}</p>
          <Button asChild variant="outline">
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const registrationCount = event.registrations?.filter(reg => reg.status === 'REGISTERED').length || 0;
  const spotsLeft = event.maxCapacity ? event.maxCapacity - registrationCount : null;

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
            <Link href="/events" className="hover:text-foreground transition-colors">
              Events
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-foreground font-medium">{event.title}</span>
          </nav>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <Badge 
                variant="secondary" 
                className={cn("mb-4", getEventTypeColor(event.eventType))}
              >
                {getEventTypeLabel(event.eventType)}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={copyEventUrl}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Event
              </Button>
            </div>

            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

            {/* Event Meta Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">
                      {formatEventDateTime(event.startDateTime, event.location)}
                    </div>
                    {event.endDateTime && (
                      <div className="text-sm text-muted-foreground">
                        Ends: {formatEventDateTime(event.endDateTime, event.location)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{event.location}</div>
                    {event.address && (
                      <div className="text-sm text-muted-foreground">{event.address}</div>
                    )}
                  </div>
                </div>

                {event.maxCapacity && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">
                        {registrationCount} / {event.maxCapacity} registered
                      </div>
                      {spotsLeft !== null && (
                        <div className="text-sm text-muted-foreground">
                          {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Event is full'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Section */}
              <div className="flex flex-col justify-center">
                {!userLoading && user ? (
                  <div className="space-y-3">
                    {isRegistered ? (
                      <>
                        <div className="text-green-600 font-medium flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          You&apos;re registered for this event
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleUnregister}
                          disabled={isRegistering}
                          className="w-full"
                        >
                          {isRegistering ? 'Processing...' : 'Unregister'}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleRegister}
                        disabled={isRegistering || (spotsLeft !== null && spotsLeft <= 0)}
                        className="w-full"
                        size="lg"
                      >
                        {isRegistering ? 'Registering...' : 
                         spotsLeft !== null && spotsLeft <= 0 ? 'Event Full' : 'Register for Event'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm">Sign in to register for this event</p>
                    <Button asChild className="w-full" size="lg">
                      <Link href="/api/auth/login">Sign In to Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Event Image */}
          {event.imageUrl && (
            <div className="mb-8">
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Event Description */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">About this event</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>
          </Card>

          {/* Calendar Integration */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add to Calendar</h2>
            <p className="text-muted-foreground mb-4">
              Save this event to your calendar so you don't miss it!
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={generateCalendarLink('google', {
                    title: event.title,
                    description: event.description,
                    startDateTime: event.startDateTime,
                    endDateTime: event.endDateTime,
                    location: event.location
                  })} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Google Calendar
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={generateCalendarLink('outlook', {
                    title: event.title,
                    description: event.description,
                    startDateTime: event.startDateTime,
                    endDateTime: event.endDateTime,
                    location: event.location
                  })} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Outlook
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadICSFile({
                  title: event.title,
                  description: event.description,
                  startDateTime: event.startDateTime,
                  endDateTime: event.endDateTime,
                  location: event.location,
                  id: event.id
                })}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Download (.ics)
              </Button>
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">
                Comments ({event.comments?.length || 0})
              </h2>
            </div>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this event..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">
                  <Link href="/api/auth/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                  {' '}to leave a comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {event.comments && event.comments.length > 0 ? (
                event.comments.map((comment) => (
                  <div key={comment.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium">
                        {comment.user.firstName} {comment.user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}