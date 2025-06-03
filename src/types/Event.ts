// src/types/Event.ts
export interface Event {
  id: string | number;
  title: string;
  start: Date | string;
  end?: Date | string;
  room?: string;
  professor?: string;
  semester?: string;  // Adicionado campo semestre
  class?: string;     // Adicionado campo turma
  type?: 'calculus' | 'math' | 'algorithms' | 'practices' | 'challenges';
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  allDay?: boolean;
  extendedProps?: {
    room?: string;
    professor?: string;
    type?: string;
    roomInfo?: string;
    semester?: string;
    class?: string;
  };
}

// Event type colors mapping
export const EVENT_TYPE_COLORS = {
  calculus: { bg: '#d1fae5', border: '#10b981' },
  math: { bg: '#dbeafe', border: '#3b82f6' },
  algorithms: { bg: '#fef3c7', border: '#f59e0b' },
  practices: { bg: '#e9d5ff', border: '#8b5cf6' },
  challenges: { bg: '#fecaca', border: '#f87171' }
} as const;

// Helper function to get colors for event type
export const getEventTypeColors = (type: keyof typeof EVENT_TYPE_COLORS = 'math') => {
  return EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.math;
};

// Fixed week dates - first week of 2020 (January 6-10, 2020)
export const FIXED_WEEK_DATES = {
  monday: new Date(2020, 0, 6),    // January 6, 2020
  tuesday: new Date(2020, 0, 7),   // January 7, 2020
  wednesday: new Date(2020, 0, 8), // January 8, 2020
  thursday: new Date(2020, 0, 9),  // January 9, 2020
  friday: new Date(2020, 0, 10)    // January 10, 2020
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

// Helper function to create event with fixed date
export const createEventWithFixedDate = (
  title: string,
  dayName: string,
  startTime: string,
  endTime: string,
  options: {
    room?: string;
    professor?: string;
    semester?: string;  // Adicionado parâmetro semestre
    class?: string;     // Adicionado parâmetro turma
    type?: keyof typeof EVENT_TYPE_COLORS;
    id?: string | number;
  } = {}
): Event => {
  const baseDate = getFixedDateForDay(dayName);
  const colors = getEventTypeColors(options.type);
  
  // Parse start time
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const startDate = new Date(baseDate);
  startDate.setHours(startHour, startMinute, 0, 0);
  
  // Parse end time
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const endDate = new Date(baseDate);
  endDate.setHours(endHour, endMinute, 0, 0);
  
  return {
    id: options.id || `event-${Date.now()}-${Math.random()}`,
    title,
    start: startDate,
    end: endDate,
    room: options.room,
    professor: options.professor,
    semester: options.semester,  // Incluído no objeto de retorno
    class: options.class,        // Incluído no objeto de retorno
    type: options.type || 'math',
    backgroundColor: colors.bg,
    borderColor: colors.border,
    textColor: '#000000',
    allDay: false,
    extendedProps: {
      room: options.room,
      professor: options.professor,
      type: options.type || 'math',
      semester: options.semester,
      class: options.class
    }
  };
};

// Helper function to snap times to half-hour slots (7:30 based)
export const snapToHalfHour = (date: Date): Date => {
  const roundedDate = new Date(date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // If minutes are less than 15, snap to the previous :30
  if (minutes < 15) {
    if (hours === 0) {
      // Special case: very early morning
      roundedDate.setHours(0);
      roundedDate.setMinutes(30, 0, 0);
    } else {
      roundedDate.setHours(hours - 1);
      roundedDate.setMinutes(30, 0, 0);
    }
  } 
  // If minutes are between 15 and 45, snap to the current hour's :30
  else if (minutes >= 15 && minutes < 45) {
    roundedDate.setMinutes(30, 0, 0);
  } 
  // If minutes are 45 or more, snap to the next hour's :30
  else {
    roundedDate.setHours(hours + 1);
    roundedDate.setMinutes(30, 0, 0);
  }
  
  return roundedDate;
};