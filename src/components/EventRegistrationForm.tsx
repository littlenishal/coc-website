'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Calendar, Clock, MapPin, Users, CheckCircle2, AlertCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  maxCapacity?: number;
  registrations?: Array<{
    id: string;
    userId: string;
    status: string;
  }>;
}

interface EventRegistrationFormProps {
  event: Event;
  onRegistrationComplete?: () => void;
}

export default function EventRegistrationForm({ event, onRegistrationComplete }: EventRegistrationFormProps) {
  const { user, isLoading: userLoading } = useUser();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate registration stats
  const registrations = event.registrations || [];
  const registeredCount = registrations.filter(r => r.status === 'REGISTERED').length;
  const spotsRemaining = event.maxCapacity ? event.maxCapacity - registeredCount : null;
  const isCapacityFull = event.maxCapacity ? registeredCount >= event.maxCapacity : false;

  // Check if user is already registered
  const userRegistration = registrations.find(r => r.userId === user?.sub);
  const isAlreadyRegistered = !!userRegistration;

  const handleRegistration = async () => {
    if (!user) {
      window.location.href = '/api/auth/login';
      return;
    }

    setIsRegistering(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setRegistrationStatus('success');
      onRegistrationComplete?.();
    } catch (error) {
      setRegistrationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancellation = async () => {
    if (!user || !userRegistration) return;

    setIsRegistering(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Cancellation failed');
      }

      setRegistrationStatus('success');
      onRegistrationComplete?.();
    } catch (error) {
      setRegistrationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Cancellation failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Show success message
  if (registrationStatus === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">
              {isAlreadyRegistered ? 'Registration Cancelled' : 'Registration Successful!'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isAlreadyRegistered 
                ? 'Your registration has been cancelled successfully.' 
                : 'You have been registered for this event.'
              }
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setRegistrationStatus('idle');
                onRegistrationComplete?.();
              }}
              className="mt-4"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">
          {isAlreadyRegistered ? 'Manage Registration' : 'Event Registration'}
        </CardTitle>
        <CardDescription>
          {event.title}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Details Summary */}
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(event.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          {event.maxCapacity && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {registeredCount} / {event.maxCapacity} registered
                {spotsRemaining !== null && spotsRemaining > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {spotsRemaining} spots left
                  </Badge>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Capacity Warning */}
        {isCapacityFull && !isAlreadyRegistered && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              This event is full. You will be added to the waitlist.
            </span>
          </div>
        )}

        {/* Registration Status */}
        {isAlreadyRegistered && userRegistration && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                You are registered for this event
                {userRegistration.status === 'WAITLISTED' && ' (Waitlisted)'}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {(registrationStatus === 'error' || errorMessage) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          {!userLoading && !user && (
            <Button onClick={() => window.location.href = '/api/auth/login'} className="w-full">
              Sign In to Register
            </Button>
          )}

          {user && !isAlreadyRegistered && (
            <Button
              onClick={handleRegistration}
              disabled={isRegistering}
              className="w-full"
            >
              {isRegistering 
                ? 'Registering...' 
                : isCapacityFull 
                ? 'Join Waitlist' 
                : 'Register for Event'
              }
            </Button>
          )}

          {user && isAlreadyRegistered && (
            <Button
              onClick={handleCancellation}
              disabled={isRegistering}
              variant="destructive"
              className="w-full"
            >
              {isRegistering ? 'Cancelling...' : 'Cancel Registration'}
            </Button>
          )}
        </div>

        {/* Login Prompt */}
        {!user && (
          <p className="text-center text-sm text-gray-600">
            Please sign in to register for this event
          </p>
        )}
      </CardContent>
    </Card>
  );
}