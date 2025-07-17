
export interface CalendarEvent {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  id?: string;
}

export function generateCalendarLink(provider: 'google' | 'outlook', event: CalendarEvent): string {
  const startDate = new Date(event.startDateTime);
  const endDate = new Date(event.endDateTime);
  
  if (provider === 'google') {
    const start = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${start}/${end}`,
      details: event.description,
      location: event.location
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } else if (provider === 'outlook') {
    const params = new URLSearchParams({
      subject: event.title,
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      body: event.description,
      location: event.location
    });
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }
  
  return '';
}

export function downloadICSFile(event: CalendarEvent): void {
  const startDate = new Date(event.startDateTime);
  const endDate = new Date(event.endDateTime);
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Captains of Commerce//Event//EN',
    'BEGIN:VEVENT',
    `UID:${event.id || Date.now()}@captainsofcommerce.com`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
  
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
