import { CalendarOptions } from '@fullcalendar/core';

export const calendarConfig: CalendarOptions = {
  initialView: "timeGridWeek",
  headerToolbar: false,
  // headerToolbar: {
  //   left: '',
  //   center: 'title',
  //   right: 'timeGridWeek,dayGridWeek,listWeek'
  // },
  dayHeaderFormat: { weekday: 'short' },
  editable: true,
  selectable: false,
  selectMirror: true,
  droppable: true,
  slotMinTime: "07:30:00",
  slotMaxTime: "22:30:00",
  allDaySlot: false,
  displayEventTime: true,
  displayEventEnd: true,
  // Change the text that appeats on daygridweek button
  buttonText: {
    dayGridWeek: 'Agenda Semanal'
  },

  titleFormat: () => 'Agenda Semanal',
  // Update snap duration to 1 hour to match the 7:30, 8:30 pattern
  snapDuration: "01:00:00", 
  slotDuration: "01:00:00", 
  slotLabelInterval: "01:00:00",
  
  // Make default event duration match slot duration
  defaultTimedEventDuration: "01:00:00",
  forceEventDuration: true,
  
  // Additional constraints for time snapping
  eventDurationEditable: true,
  nowIndicator:false,
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
    hour12: false
  },
  eventStartEditable: true,

  
  // Add event constraints
  eventConstraint: {
    startTime: "07:30",
    endTime: "22:30",
  },
  
  // Add drag scroll capability
  dragScroll: true,
};