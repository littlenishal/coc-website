
'use client';

import { Button } from "@/components/ui/button";
import { X, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateCalendarLink, downloadICSFile } from "@/lib/calendar";

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

type EventModalProps = {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
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

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!isOpen || !event) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <span 
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-full border",
                getEventTypeColor(event.eventType)
              )}
            >
              {getEventTypeLabel(event.eventType)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <h1 id="event-modal-title" className="text-2xl font-bold mb-4">
            {event.title}
          </h1>

          <div className="space-y-4 mb-6">
            {/* Date and Time */}
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

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">{event.location}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">About this event</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Add to Calendar Options */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Add to Calendar</h3>
            <div className="flex flex-wrap gap-2">
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
                >
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
                >
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
              >
                Download .ics
              </Button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose} className="order-3 sm:order-1">
            Close
          </Button>
          <Button variant="outline" asChild className="order-2 sm:order-2">
            <a href={`/events/${event.id}`} target="_blank">
              View Full Details
            </a>
          </Button>
          <Button className="order-1 sm:order-3">
            Register for Event
          </Button>
        </div>
      </div>
    </div>
  );
}
