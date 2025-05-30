'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

type CalendarProps = {
  events: Event[];
  onEventClick: (event: Event) => void;
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Timezone mapping based on location
const getTimezoneFromLocation = (location: string): string => {
  const locationLower = location.toLowerCase();

  // Eastern Time states/cities
  if (locationLower.includes('arlington') || locationLower.includes('virginia') || 
      locationLower.includes('va') || locationLower.includes('washington dc') ||
      locationLower.includes('new york') || locationLower.includes('ny') ||
      locationLower.includes('florida') || locationLower.includes('fl') ||
      locationLower.includes('georgia') || locationLower.includes('ga') ||
      locationLower.includes('north carolina') || locationLower.includes('nc') ||
      locationLower.includes('south carolina') || locationLower.includes('sc')) {
    return 'America/New_York';
  }

  // Central Time states/cities
  if (locationLower.includes('chicago') || locationLower.includes('illinois') ||
      locationLower.includes('il') || locationLower.includes('texas') ||
      locationLower.includes('tx') || locationLower.includes('minnesota') ||
      locationLower.includes('mn') || locationLower.includes('wisconsin') ||
      locationLower.includes('wi') || locationLower.includes('iowa') ||
      locationLower.includes('missouri') || locationLower.includes('mo')) {
    return 'America/Chicago';
  }

  // Mountain Time states/cities
  if (locationLower.includes('denver') || locationLower.includes('colorado') ||
      locationLower.includes('co') || locationLower.includes('utah') ||
      locationLower.includes('ut') || locationLower.includes('arizona') ||
      locationLower.includes('az') || locationLower.includes('new mexico') ||
      locationLower.includes('nm')) {
    return 'America/Denver';
  }

  // Pacific Time states/cities
  if (locationLower.includes('california') || locationLower.includes('ca') ||
      locationLower.includes('los angeles') || locationLower.includes('san francisco') ||
      locationLower.includes('seattle') || locationLower.includes('washington') ||
      locationLower.includes('wa') || locationLower.includes('oregon') ||
      locationLower.includes('or')) {
    return 'America/Los_Angeles';
  }

  // Default to Eastern Time if location not recognized
  return 'America/New_York';
};

const formatEventTime = (dateTime: string, location: string): string => {
  const timezone = getTimezoneFromLocation(location);
  const date = new Date(dateTime);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short'
  }).format(date);
};

export function Calendar({ events, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { year, month } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth()
  }), [currentDate]);

  const firstDayOfMonth = useMemo(() => new Date(year, month, 1), [year, month]);
  const startDate = useMemo(() => {
    const start = new Date(firstDayOfMonth);
    start.setDate(start.getDate() - start.getDay());
    return start;
  }, [firstDayOfMonth]);

  const calendarDays = useMemo(() => {
    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) { // 6 weeks × 7 days
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [startDate]);

  const eventsByDate = useMemo(() => {
    const eventMap = new Map<string, Event[]>();

    events.forEach(event => {
      const eventDate = new Date(event.startDateTime);
      const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;

      if (!eventMap.has(dateKey)) {
        eventMap.set(dateKey, []);
      }
      eventMap.get(dateKey)!.push(event);
    });

    return eventMap;
  }, [events]);

  const getEventsForDate = (date: Date): Event[] => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return eventsByDate.get(dateKey) || [];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === month;
  };

  const handleKeyDown = (event: React.KeyboardEvent, date: Date) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        onEventClick(dayEvents[0]); // Click first event for keyboard navigation
      }
    }
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('prev')}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('next')}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {/* Day Headers */}
        {DAYS_OF_WEEK.map(day => (
          <div
            key={day}
            className="bg-muted p-3 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              className={cn(
                "bg-background min-h-[120px] p-2 border-0 relative",
                !isCurrentMonthDay && "bg-muted/30 text-muted-foreground",
                isTodayDate && "bg-primary/5 ring-1 ring-primary/20"
              )}
              role="gridcell"
              tabIndex={dayEvents.length > 0 ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, date)}
              aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}${dayEvents.length > 0 ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
            >
              {/* Date Number */}
              <div className={cn(
                "text-sm font-medium mb-1",
                isTodayDate && "text-primary font-bold"
              )}>
                {date.getDate()}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className={cn(
                      "w-full text-left text-xs p-1 rounded transition-colors",
                      "bg-primary/10 hover:bg-primary/20 text-primary",
                      "border border-primary/20 hover:border-primary/30",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50"
                    )}
                    title={`${event.title} - ${formatEventTime(event.startDateTime, event.location)}`}
                  >
                    <div className="font-medium truncate">
                      {event.title}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      {formatEventTime(event.startDateTime, event.location)}
                    </div>
                  </button>
                ))}

                {/* Show "more events" indicator */}
                {dayEvents.length > 3 && (
                  <button
                    onClick={() => onEventClick(dayEvents[3])} // Click on 4th event to show modal
                    className="w-full text-xs text-center p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +{dayEvents.length - 3} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Click on an event to view details. Times are shown in the event&apos;s local timezone.</p>
      </div>
    </div>
  );
}