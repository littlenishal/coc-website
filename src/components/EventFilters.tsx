
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, X, Calendar, Filter, ChevronDown, ChevronUp } from "lucide-react";
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

type EventFiltersProps = {
  events: Event[];
  onFilteredEventsChange: (filteredEvents: Event[]) => void;
  className?: string;
};

type DateFilter = 'all' | 'upcoming' | 'this-month' | 'custom';

const EVENT_TYPE_OPTIONS = [
  { value: 'TOY_DRIVE', label: 'Toy Drive' },
  { value: 'FOOD_DRIVE', label: 'Food Drive' },
  { value: 'FUNDRAISER', label: 'Fundraiser' },
  { value: 'OTHER', label: 'Other' }
];

const DATE_FILTER_OPTIONS = [
  { value: 'all' as DateFilter, label: 'All Events' },
  { value: 'upcoming' as DateFilter, label: 'Upcoming' },
  { value: 'this-month' as DateFilter, label: 'This Month' },
  { value: 'custom' as DateFilter, label: 'Custom Range' }
];

export function EventFilters({ events, onFilteredEventsChange, className }: EventFiltersProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>('upcoming');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let hasUrlFilters = false;
    
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      hasUrlFilters = true;
    }
    
    const typesParam = urlParams.get('types');
    if (typesParam) {
      setSelectedEventTypes(typesParam.split(','));
      hasUrlFilters = true;
    }
    
    const dateParam = urlParams.get('date') as DateFilter;
    if (dateParam && DATE_FILTER_OPTIONS.find(opt => opt.value === dateParam)) {
      setDateFilter(dateParam);
      if (dateParam !== 'upcoming') hasUrlFilters = true;
    }
    
    const startDateParam = urlParams.get('start_date');
    if (startDateParam) {
      setCustomStartDate(startDateParam);
      hasUrlFilters = true;
    }
    
    const endDateParam = urlParams.get('end_date');
    if (endDateParam) {
      setCustomEndDate(endDateParam);
      hasUrlFilters = true;
    }

    // Expand filters if there are active filters from URL
    if (hasUrlFilters) {
      setIsCollapsed(false);
    }
  }, []);

  // Filter events based on current filter state
  useEffect(() => {
    let filteredEvents = [...events];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }

    // Event type filter
    if (selectedEventTypes.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        selectedEventTypes.includes(event.eventType)
      );
    }

    // Date filter
    const now = new Date();
    switch (dateFilter) {
      case 'upcoming':
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.startDateTime) >= now
        );
        break;
      case 'this-month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.startDateTime);
          return eventDate >= startOfMonth && eventDate <= endOfMonth;
        });
        break;
      case 'custom':
        if (customStartDate || customEndDate) {
          filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.startDateTime);
            const start = customStartDate ? new Date(customStartDate) : new Date('1900-01-01');
            const end = customEndDate ? new Date(customEndDate + 'T23:59:59') : new Date('2100-12-31');
            return eventDate >= start && eventDate <= end;
          });
        }
        break;
    }

    onFilteredEventsChange(filteredEvents);
  }, [events, searchQuery, selectedEventTypes, dateFilter, customStartDate, customEndDate, onFilteredEventsChange]);

  // Update URL parameters when filters change
  useEffect(() => {
    const url = new URL(window.location.href);
    
    if (searchQuery) {
      url.searchParams.set('search', searchQuery);
    } else {
      url.searchParams.delete('search');
    }
    
    if (selectedEventTypes.length > 0) {
      url.searchParams.set('types', selectedEventTypes.join(','));
    } else {
      url.searchParams.delete('types');
    }
    
    if (dateFilter !== 'upcoming') {
      url.searchParams.set('date', dateFilter);
    } else {
      url.searchParams.delete('date');
    }
    
    if (customStartDate) {
      url.searchParams.set('start_date', customStartDate);
    } else {
      url.searchParams.delete('start_date');
    }
    
    if (customEndDate) {
      url.searchParams.set('end_date', customEndDate);
    } else {
      url.searchParams.delete('end_date');
    }

    window.history.replaceState({}, '', url.toString());
  }, [searchQuery, selectedEventTypes, dateFilter, customStartDate, customEndDate]);

  const handleEventTypeToggle = (eventType: string) => {
    setSelectedEventTypes(prev => 
      prev.includes(eventType)
        ? prev.filter(type => type !== eventType)
        : [...prev, eventType]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedEventTypes([]);
    setDateFilter('upcoming');
    setCustomStartDate('');
    setCustomEndDate('');
    setIsCollapsed(true);
  };

  const hasActiveFilters = searchQuery || selectedEventTypes.length > 0 || dateFilter !== 'upcoming' || customStartDate || customEndDate;

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Collapsible Header */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-between p-0 h-auto hover:bg-transparent"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Filter Events</h3>
            {hasActiveFilters && !isCollapsed && (
              <Badge variant="secondary" className="text-xs">
                {[
                  searchQuery && 'Search',
                  selectedEventTypes.length > 0 && `${selectedEventTypes.length} Type${selectedEventTypes.length > 1 ? 's' : ''}`,
                  dateFilter !== 'upcoming' && 'Date',
                  customStartDate && 'Custom'
                ].filter(Boolean).join(', ')}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                className="flex items-center gap-1 text-xs h-6 px-2"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </div>
        </Button>
      </div>

      {/* Filter Content */}
      {!isCollapsed && (
        <div className="p-6 space-y-6">

        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Event Type Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Event Types</label>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPE_OPTIONS.map((option) => (
              <Badge
                key={option.value}
                variant={selectedEventTypes.includes(option.value) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => handleEventTypeToggle(option.value)}
              >
                {option.label}
                {selectedEventTypes.includes(option.value) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Date Range</label>
          <div className="flex flex-wrap gap-2">
            {DATE_FILTER_OPTIONS.map((option) => (
              <Badge
                key={option.value}
                variant={dateFilter === option.value ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => setDateFilter(option.value)}
              >
                <Calendar className="mr-1 h-3 w-3" />
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Custom Date Range */}
        {dateFilter === 'custom' && (
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <label className="text-sm font-medium">Custom Date Range</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Start Date</label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">End Date</label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-3 border-t">
              <div className="text-sm text-muted-foreground mb-2">Active filters:</div>
              <div className="flex flex-wrap gap-1">
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {selectedEventTypes.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {EVENT_TYPE_OPTIONS.find(opt => opt.value === type)?.label}
                  </Badge>
                ))}
                {dateFilter !== 'upcoming' && (
                  <Badge variant="secondary" className="text-xs">
                    {DATE_FILTER_OPTIONS.find(opt => opt.value === dateFilter)?.label}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
