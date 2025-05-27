// src/components/Timetable.tsx
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { calendarConfig } from '@/config/calendarConfig';
import { createEventContent } from '@/utils/calendarUtils';

interface Event {
    title: string;
    room?: string;
    teacher?: string;
    start: Date | string;
    allDay: boolean;
    id: number;
    end?: Date | string;
}

interface EventCalendarProps {
    events: Event[];
    onEventReceive?: (info: any) => void;
    onEventDrop?: (info: any) => void;
    onEventResize?: (info: any) => void;
    onEventClick?: (info: any) => void;
}
const renderDayHeaderContent = (arg: any) => {
    // Abreviações em inglês dos dias da semana
    const englishAbbr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    // Dias da semana em português
    const ptDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    // Obtém o índice do dia da semana (0-6)
    const dayIndex = arg.date.getDay();
    
    return {
      html: `
        <div class="fc-day-header-custom">
          <div class="fc-day-abbr">${englishAbbr[dayIndex]}</div>
          <div class="fc-day-name">${ptDays[dayIndex]}</div>
        </div>
      `
    };
  };


export const EventCalendar: React.FC<EventCalendarProps> = ({
    events,
    onEventReceive,
    onEventDrop,
    onEventResize,
    onEventClick
}) => {
    // Helper function to snap times to the 7:30-based half-hour slots
    const snapToHalfHour = (date: Date): Date => {
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

    return (
        <FullCalendar
            {...calendarConfig}
            plugins={[interactionPlugin, timeGridPlugin, listPlugin, dayGridPlugin]}
            locale={ptBrLocale}
            events={events}
            slotEventOverlap={false} // Evita sobreposição de eventos
            eventContent={createEventContent}
            eventReceive={onEventReceive}
            eventDrop={onEventDrop}
            eventResize={onEventResize}
            eventClick={onEventClick}
            height="100%"
            dayHeaderContent={renderDayHeaderContent}
            

            eventResizeStart={(info) => {
                // Apply half-hour snapping at the start of resize
                if (info.event.start) {
                    const snappedStart = snapToHalfHour(info.event.start);
                    info.event.setStart(snappedStart);
                }
            }}
            eventResizeStop={(info) => {
                // Apply half-hour snapping at the end of resize
                if (info.event.end) {
                    const snappedEnd = snapToHalfHour(info.event.end);
                    info.event.setEnd(snappedEnd);
                }
                
                // Also ensure start time is on half-hour boundary
                if (info.event.start) {
                    const snappedStart = snapToHalfHour(info.event.start);
                    info.event.setStart(snappedStart);
                }
            }}
            eventConstraint={{
                startTime: "07:30", // Limita eventos dentro do dia
                endTime: "22:30",
              }}
        />
    );
};