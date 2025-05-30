
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Calendar, ChevronDown, Loader2 } from "lucide-react";
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

type EventListProps = {
  events: Event[];
  onEventClick: (event: Event) => void;
};

type SortOption = 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc' | 'type-asc' | 'type-desc';

const EVENTS_PER_PAGE = 12;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date-asc', label: 'Date - Earliest First' },
  { value: 'date-desc', label: 'Date - Latest First' },
  { value: 'title-asc', label: 'Title - A to Z' },
  { value: 'title-desc', label: 'Title - Z to A' },
  { value: 'type-asc', label: 'Event Type - A to Z' },
  { value: 'type-desc', label: 'Event Type - Z to A' }
];

// Timezone mapping based on location
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

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short'
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);

  return `${formattedDate} at ${formattedTime}`;
};

const EventCard = ({ event, onClick }: { event: Event; onClick: () => void }) => {
  return (
    <div 
      className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* Placeholder for future image */}
      <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
        <Calendar className="h-12 w-12 text-primary/30" />
      </div>

      {/* Event Type Badge */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
          {event.eventType}
        </span>
      </div>

      {/* Event Title */}
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
        {event.title}
      </h3>

      {/* Date and Time */}
      <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div>
          <div>{formatEventDateTime(event.startDateTime, event.location)}</div>
          {event.endDateTime && event.endDateTime !== event.startDateTime && (
            <div className="text-xs">
              Ends: {formatEventDateTime(event.endDateTime, event.location)}
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{event.location}</span>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed">
        {event.description}
      </p>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="bg-card border rounded-lg p-6 animate-pulse">
    <div className="w-full h-48 bg-muted rounded-lg mb-4" />
    <div className="h-6 bg-muted rounded w-24 mb-3" />
    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
    <div className="h-4 bg-muted rounded w-full mb-1" />
    <div className="h-4 bg-muted rounded w-2/3 mb-3" />
    <div className="h-4 bg-muted rounded w-1/2 mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="h-4 bg-muted rounded w-4/5" />
    </div>
  </div>
);

export function EventList({ events, onEventClick }: EventListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Sort events based on selected option
  const sortedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
        case 'date-desc':
          return new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'type-asc':
          return a.eventType.localeCompare(b.eventType);
        case 'type-desc':
          return b.eventType.localeCompare(a.eventType);
        default:
          return 0;
      }
    });
    return sorted;
  }, [events, sortBy]);

  // Initialize displayed events
  useEffect(() => {
    setDisplayedEvents(sortedEvents.slice(0, EVENTS_PER_PAGE));
    setHasMore(sortedEvents.length > EVENTS_PER_PAGE);
  }, [sortedEvents]);

  // Load more events (infinite scroll simulation)
  const loadMoreEvents = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const currentLength = displayedEvents.length;
      const nextBatch = sortedEvents.slice(currentLength, currentLength + EVENTS_PER_PAGE);
      
      setDisplayedEvents(prev => [...prev, ...nextBatch]);
      setHasMore(currentLength + EVENTS_PER_PAGE < sortedEvents.length);
      setIsLoading(false);
    }, 800);
  }, [displayedEvents.length, sortedEvents, isLoading, hasMore]);

  // Handle scroll to bottom for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollTop + clientHeight >= scrollHeight - 1000 && !isLoading && hasMore) {
        loadMoreEvents();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreEvents, isLoading, hasMore]);

  // Update URL params when sort changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', sortBy);
    window.history.replaceState({}, '', url.toString());
  }, [sortBy]);

  // Initialize sort from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get('sort') as SortOption;
    if (sortParam && SORT_OPTIONS.find(opt => opt.value === sortParam)) {
      setSortBy(sortParam);
    }
  }, []);

  const selectedSortLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Sort by';

  return (
    <div className="w-full space-y-6">
      {/* Header with Sort Dropdown */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {displayedEvents.length} of {sortedEvents.length} Events
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {sortedEvents.length === 0 ? 'No events found' : 'Scroll down to load more events'}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-2 min-w-[200px] justify-between"
          >
            <span className="truncate">{selectedSortLabel}</span>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isSortDropdownOpen && "rotate-180"
            )} />
          </Button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg z-10">
              <div className="p-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-muted focus:bg-muted focus:outline-none",
                      sortBy === option.value && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Events Found</h3>
          <p className="text-muted-foreground">
            There are no published events available at this time.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
              />
            ))}
            
            {/* Loading skeletons */}
            {isLoading && (
              <>
                {Array.from({ length: Math.min(EVENTS_PER_PAGE, 6) }).map((_, index) => (
                  <LoadingSkeleton key={`skeleton-${index}`} />
                ))}
              </>
            )}
          </div>

          {/* Load More Button (fallback for infinite scroll) */}
          {hasMore && !isLoading && (
            <div className="text-center pt-8">
              <Button
                onClick={loadMoreEvents}
                variant="outline"
                className="px-8"
              >
                Load More Events
              </Button>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more events...</span>
              </div>
            </div>
          )}

          {/* End of results */}
          {!hasMore && displayedEvents.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>You&apos;ve reached the end of the events list.</p>
            </div>
          )}
        </>
      )}

      {/* Click outside to close dropdown */}
      {isSortDropdownOpen && (
        <div 
          className="fixed inset-0 z-[5]" 
          onClick={() => setIsSortDropdownOpen(false)}
        />
      )}
    </div>
  );
}
