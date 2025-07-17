import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date').optional(),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['TOY_DRIVE', 'FOOD_DRIVE', 'FUNDRAISER']),
  capacity: z.number().int().positive().optional(),
  isPublished: z.boolean().default(false),
  registrationUrl: z.string().url().optional()
});

export type EventInput = z.infer<typeof eventSchema>;

export const validateEvent = async (data: unknown) => {
  return eventSchema.parseAsync(data);
};