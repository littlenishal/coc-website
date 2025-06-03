
export const generateICSFile = (event: {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  id: string;
}): string => {
  const startDate = new Date(event.startDateTime);
  const endDate = new Date(event.endDateTime);
  
  // Format dates for ICS (YYYYMMDDTHHMMSSZ)
  const formatDateForICS = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Captains of Commerce//Event Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@captainsofcommerce.org`,
    `DTSTART:${formatDateForICS(startDate)}`,
    `DTEND:${formatDateForICS(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `DTSTAMP:${formatDateForICS(new Date())}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
};

export const downloadICSFile = (event: {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  id: string;
}): void => {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateCalendarLink = (
  type: 'google' | 'outlook',
  event: {
    title: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    location: string;
  }
): string => {
  const startDate = new Date(event.startDateTime);
  const endDate = new Date(event.endDateTime);
  
  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  if (type === 'google') {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`,
      details: event.description,
      location: event.location,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  if (type === 'outlook') {
    const params = new URLSearchParams({
      subject: event.title,
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      body: event.description,
      location: event.location
    });
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  return '#';
};
