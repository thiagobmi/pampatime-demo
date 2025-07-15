import * as React from 'react';

export const formatEventTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  hour12: false });
};

export const createEventContent = (eventInfo: any) => {
  const start = eventInfo.event.start;
  const end = eventInfo.event.end || new Date(start.getTime() + 60*60*1000);
  
  // Access properties from extendedProps (this is where FullCalendar stores custom properties)
  const professor = eventInfo.event.extendedProps?.professor;
  const room = eventInfo.event.extendedProps?.room;
  
  console.log('Event content - professor:', professor, 'room:', room);
  console.log('Full extendedProps:', eventInfo.event.extendedProps);
  
  const startTime = formatEventTime(start);
  const endTime = formatEventTime(end);
  
  // Check event duration in milliseconds
  const durationMs = end.getTime() - start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  
  // Only show additional details if event is long enough
  // Events shorter than 1 hour will only show the title and time
  const showDetails = durationHours > 1;
  
  // Get background color from the event (fallback to white if not set)
  const backgroundColor = eventInfo.event.backgroundColor || '#ffffff';
  const textColor = '#333333'; // Always use black text for better readability
  
  return (
    <div 
      className='text-center w-full h-full p-1 overflow-hidden' 
      style={{ backgroundColor, color: textColor }}
    >
      <div className='text-sm truncate'><b>{startTime} - {endTime}</b></div>
      <div className='font-bold truncate'>{eventInfo.event.title}</div>
      {showDetails && professor && 
        <div className='truncate text-xs'><b>{professor}</b></div>
      }
      {showDetails && room && 
        <div className='truncate text-xs'><b>{room}</b></div>
      }
    </div>
  );
};