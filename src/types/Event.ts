// src/types/Event.ts
export interface Event {
  id: string | number;
  title: string;
  start: Date | string;
  end?: Date | string;
  room?: string;
  professor?: string;
  semester?: string;
  class?: string;
  type?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  allDay?: boolean;
}

export interface EventColors {
  bg: string;
  border: string;
  text: string;
}

// Helper function to generate consistent colors based on string hash
const generateColorsFromString = (str: string): EventColors => {
  if (!str || str.trim() === '') {
    // Default colors for empty/undefined types
    return {
      bg: '#f3f4f6',
      border: '#9ca3af',
      text: '#374151'
    };
  }
  
  // Create a hash from the string
  let hash = 0;
  const normalizedStr = str.toLowerCase().trim();
  
  for (let i = 0; i < normalizedStr.length; i++) {
    const char = normalizedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate HSL color from hash
  const hue = Math.abs(hash) % 360;
  
  // Use different ranges for better color distribution
  const saturation = 45 + (Math.abs(hash >> 8) % 35); // 45-80% saturation
  const lightness = 88; // Light background for readability
  const borderLightness = 50; // Darker border
  const textLightness = 25; // Dark text for contrast
  
  return {
    bg: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    border: `hsl(${hue}, ${saturation}%, ${borderLightness}%)`,
    text: `hsl(${hue}, ${saturation}%, ${textLightness}%)`
  };
};

// Main function to get colors for event type
export const getEventTypeColors = (type: string = ''): EventColors => {
  return generateColorsFromString(type);
};

// Fixed week dates - first week of 2020 (January 6-10, 2020)
export const FIXED_WEEK_DATES = {
  monday: new Date(2020, 0, 6),
  tuesday: new Date(2020, 0, 7),
  wednesday: new Date(2020, 0, 8),
  thursday: new Date(2020, 0, 9),
  friday: new Date(2020, 0, 10)
} as const;

// Helper function to get fixed date for a day
export const getFixedDateForDay = (dayName: string): Date => {
  const dayMap: { [key: string]: Date } = {
    'Segunda': FIXED_WEEK_DATES.monday,
    'Terça': FIXED_WEEK_DATES.tuesday,
    'Quarta': FIXED_WEEK_DATES.wednesday,
    'Quinta': FIXED_WEEK_DATES.thursday,
    'Sexta': FIXED_WEEK_DATES.friday,
    'Monday': FIXED_WEEK_DATES.monday,
    'Tuesday': FIXED_WEEK_DATES.tuesday,
    'Wednesday': FIXED_WEEK_DATES.wednesday,
    'Thursday': FIXED_WEEK_DATES.thursday,
    'Friday': FIXED_WEEK_DATES.friday
  };
  
  return dayMap[dayName] || FIXED_WEEK_DATES.monday;
};

// Helper function to apply colors to an event
export const applyEventColors = (event: Partial<Event>): Event => {
  const colors = getEventTypeColors(event.type || '');
  
  return {
    ...event,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    textColor: colors.text,
  } as Event;
};

// Helper function to create event with fixed date and auto-generated colors
export const createEventWithFixedDate = (
  title: string,
  dayName: string,
  startTime: string,
  endTime: string,
  options: {
    room?: string;
    professor?: string;
    semester?: string;
    class?: string;
    type?: string;
    id?: string | number;
  } = {}
): Event => {
  const baseDate = getFixedDateForDay(dayName);
  
  // Parse start time
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const startDate = new Date(baseDate);
  startDate.setHours(startHour, startMinute, 0, 0);
  
  // Parse end time
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const endDate = new Date(baseDate);
  endDate.setHours(endHour, endMinute, 0, 0);
  
  // Create base event
  const baseEvent: Partial<Event> = {
    id: options.id || `event-${Date.now()}-${Math.random()}`,
    title,
    start: startDate,
    end: endDate,
    room: options.room,
    professor: options.professor,
    semester: options.semester,
    class: options.class,
    type: options.type || '',
    allDay: false,
  };
  
  // Apply colors and return complete event
  return applyEventColors(baseEvent);
};

// Helper function to snap times to half-hour slots (7:30 based)
export const snapToHalfHour = (date: Date): Date => {
  const roundedDate = new Date(date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  if (minutes < 15) {
    if (hours === 0) {
      roundedDate.setHours(0);
      roundedDate.setMinutes(30, 0, 0);
    } else {
      roundedDate.setHours(hours - 1);
      roundedDate.setMinutes(30, 0, 0);
    }
  } 
  else if (minutes >= 15 && minutes < 45) {
    roundedDate.setMinutes(30, 0, 0);
  } 
  else {
    roundedDate.setHours(hours + 1);
    roundedDate.setMinutes(30, 0, 0);
  }
  
  return roundedDate;
};