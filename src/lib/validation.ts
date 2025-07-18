
import { z } from 'zod';

// Event validation schema
export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  startDateTime: z.string().min(1, 'Start date and time is required'),
  endDateTime: z.string().min(1, 'End date and time is required'),
  location: z.string().min(1, 'Location is required').max(500, 'Location must be less than 500 characters'),
  eventType: z.string().min(1, 'Event type is required'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  registrationUrl: z.string().url('Invalid registration URL').optional(),
  isPublished: z.boolean(),
});

export type EventFormData = z.infer<typeof eventSchema>;

// Validation helper function
export function validateEvent(data: unknown): { success: boolean; data?: EventFormData; errors?: string[] } {
  try {
    const validatedData = eventSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Invalid data format'] };
  }
}
