
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Calendar, Clock, MapPin, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  maxAttendees?: number;
  registrations: Array<{
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
  const [notes, setNotes] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Calculate registration stats
  const registeredCount = event.registrations?.filter(r => r.status === 'REGISTERED').length || 0;
  const spotsRemaining = event.maxAttendees ? event.maxAttendees - registeredCount : null;
  const isCapacityFull = event.maxAttendees ? registeredCount >= event.maxAttendees : false;
  
  // Check if user is already registered
  const userRegistration = event.registrations?.find(r => r.userId === user?.sub);
  const isAlreadyRegistered = !!userRegistration;

  const handleRegistration = async () => {
    if (!user) {
      window.location.href = '/api/auth/login';
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Please accept the terms and conditions to register.');
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
        body: JSON.stringify({ notes }),
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
                : isCapacityFull 
                ? 'You have been added to the waitlist. We\'ll notify you if a spot becomes available.'
                : 'You have been registered for this event. A confirmation email will be sent to you shortly.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
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
            <span>{new Date(event.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          {event.maxAttendees && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {registeredCount} / {event.maxAttendees} registered
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
        {isAlreadyRegistered && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                You are registered for this event
                {userRegistration?.status === 'WAITLISTED' && ' (Waitlisted)'}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {registrationStatus === 'error' && errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        {!isAlreadyRegistered && (
          <>
            {/* Notes Field */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Additional Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Any dietary restrictions or special requirements?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                I accept the terms and conditions and understand that I may be contacted regarding this event.
              </label>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {!userLoading && !user && (
            <Button onClick={() => window.location.href = '/api/auth/login'} className="w-full">
              Sign In to Register
            </Button>
          )}

          {user && !isAlreadyRegistered && (
            <Button
              onClick={handleRegistration}
              disabled={isRegistering || !acceptTerms}
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
