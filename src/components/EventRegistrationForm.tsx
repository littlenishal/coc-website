
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Calendar, Clock, MapPin, Users, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';

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
    numberOfGuests?: number;
    specialRequirements?: string;
    notes?: string;
  }>;
}

interface EventRegistrationFormProps {
  event: Event;
  onRegistrationComplete?: () => void;
}

interface FormData {
  numberOfGuests: number;
  specialRequirements: string;
  notes: string;
  acceptTerms: boolean;
}

interface FormErrors {
  numberOfGuests?: string;
  specialRequirements?: string;
  notes?: string;
  acceptTerms?: string;
}

export default function EventRegistrationForm({ event, onRegistrationComplete }: EventRegistrationFormProps) {
  const { user, isLoading: userLoading } = useUser();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    numberOfGuests: 1,
    specialRequirements: '',
    notes: '',
    acceptTerms: false
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Calculate registration stats
  const registrations = event.registrations || [];
  const registeredCount = registrations.filter(r => r.status === 'REGISTERED').length;
  const spotsRemaining = event.maxCapacity ? event.maxCapacity - registeredCount : null;
  const isCapacityFull = event.maxCapacity ? registeredCount >= event.maxCapacity : false;
  
  // Check if user is already registered
  const userRegistration = registrations.find(r => r.userId === user?.sub);
  const isAlreadyRegistered = !!userRegistration;

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (formData.numberOfGuests < 1) {
      errors.numberOfGuests = 'Number of guests must be at least 1';
    }

    if (formData.numberOfGuests > 10) {
      errors.numberOfGuests = 'Maximum 10 guests allowed per registration';
    }

    if (formData.specialRequirements.length > 500) {
      errors.specialRequirements = 'Special requirements must be 500 characters or less';
    }

    if (formData.notes.length > 1000) {
      errors.notes = 'Notes must be 1000 characters or less';
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions to register';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegistration = async () => {
    if (!user) {
      window.location.href = '/api/auth/login';
      return;
    }

    if (!validateForm()) {
      setErrorMessage('Please fix the errors below and try again.');
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
        body: JSON.stringify({
          numberOfGuests: formData.numberOfGuests,
          specialRequirements: formData.specialRequirements.trim() || null,
          notes: formData.notes.trim() || null
        }),
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
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                You are registered for this event
                {userRegistration.status === 'WAITLISTED' && ' (Waitlisted)'}
              </span>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              {userRegistration.numberOfGuests && userRegistration.numberOfGuests > 1 && (
                <div>Guests: {userRegistration.numberOfGuests}</div>
              )}
              {userRegistration.specialRequirements && (
                <div>Special Requirements: {userRegistration.specialRequirements}</div>
              )}
              {userRegistration.notes && (
                <div>Notes: {userRegistration.notes}</div>
              )}
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

        {/* Registration Form */}
        {!isAlreadyRegistered && (
          <>
            {/* Number of Guests */}
            <div className="space-y-2">
              <label htmlFor="numberOfGuests" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Number of Guests (including yourself)
              </label>
              <Input
                id="numberOfGuests"
                type="number"
                min="1"
                max="10"
                value={formData.numberOfGuests}
                onChange={(e) => handleInputChange('numberOfGuests', parseInt(e.target.value) || 1)}
                className={formErrors.numberOfGuests ? 'border-red-500' : ''}
              />
              {formErrors.numberOfGuests && (
                <p className="text-sm text-red-600">{formErrors.numberOfGuests}</p>
              )}
            </div>

            {/* Special Requirements */}
            <div className="space-y-2">
              <label htmlFor="specialRequirements" className="text-sm font-medium text-gray-700">
                Special Requirements
              </label>
              <Textarea
                id="specialRequirements"
                placeholder="Dietary restrictions, accessibility needs, etc."
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                rows={2}
                maxLength={500}
                className={formErrors.specialRequirements ? 'border-red-500' : ''}
              />
              <div className="flex justify-between items-center">
                {formErrors.specialRequirements && (
                  <p className="text-sm text-red-600">{formErrors.specialRequirements}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.specialRequirements.length}/500 characters
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Additional Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Any additional information you'd like to share..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                maxLength={1000}
                className={formErrors.notes ? 'border-red-500' : ''}
              />
              <div className="flex justify-between items-center">
                {formErrors.notes && (
                  <p className="text-sm text-red-600">{formErrors.notes}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.notes.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                  I accept the terms and conditions and understand that I may be contacted regarding this event. 
                  I acknowledge that registration is subject to event capacity and may result in waitlist placement if the event is full.
                </label>
              </div>
              {formErrors.acceptTerms && (
                <p className="text-sm text-red-600">{formErrors.acceptTerms}</p>
              )}
            </div>
          </>
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
