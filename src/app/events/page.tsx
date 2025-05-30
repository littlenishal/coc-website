
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, List, ChevronLeft } from "lucide-react";

export default function EventsPage() {
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  const [isLoading, setIsLoading] = useState(false);

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

      {/* Page Header */}
      <div className="container px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Event Calendar</h1>
            
            {/* View Toggle Tabs - Stack vertically on mobile */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant={currentView === 'calendar' ? 'default' : 'outline'}
                onClick={() => setCurrentView('calendar')}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Calendar className="h-4 w-4" />
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

          {/* Content Area */}
          <div className="w-full">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-6">
                {currentView === 'calendar' ? (
                  <div className="text-center py-12 space-y-4">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium">Calendar View</h3>
                    <p className="text-muted-foreground">
                      Calendar component will be implemented here
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <List className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium">List View</h3>
                    <p className="text-muted-foreground">
                      Event list component will be implemented here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
