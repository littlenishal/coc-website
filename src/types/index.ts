
export interface Event {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  eventType: string;
  imageUrl?: string;
  registrationUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  eventType: string;
  imageUrl?: string;
  registrationUrl?: string;
  isPublished: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface EventsResponse extends ApiResponse<Event[]> {
  data?: Event[];
  total?: number;
  page?: number;
  limit?: number;
}
