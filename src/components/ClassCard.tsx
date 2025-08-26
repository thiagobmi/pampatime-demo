// src/components/ClassCard.tsx
import React, { useRef, useEffect } from 'react';
import { getEventTypeColors } from '@/types/Event';

interface ClassCardProps {
  title: string;
  room?: string;
  professor?: string;
  type: string; // Modalidade
  className?: string;
  roomInfo?: string;
  event?: any;
}

const ClassCard: React.FC<ClassCardProps> = ({
  title,
  room,
  professor,
  type, // type agora representa a modalidade
  className,
  roomInfo,
  event
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Generate colors dynamically based on modalidade (type)
  const colors = getEventTypeColors(type);
  
  // Create event data for FullCalendar dragging with ALL properties
  const eventData = {
    title: title,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    textColor: colors.text,
    // Use extendedProps to store ALL custom properties
    extendedProps: {
      room: room || event?.room,
      professor: professor || event?.professor,
      type: type || event?.type, // Modalidade
      semester: event?.semester,
      class: event?.class,
      // Include any other properties from the original event
      ...event?.extendedProps
    }
  };
  
  useEffect(() => {
    if (cardRef.current) {
      // Store complete event data including all properties
      cardRef.current.setAttribute('data-event', JSON.stringify(eventData));
    }
  }, [title, room, professor, type, roomInfo, colors, event]);
  
  // Card styles with dynamic colors based on modalidade
  const cardStyle = {
    backgroundColor: colors.bg,
    borderLeft: `4px solid ${colors.border}`,
    color: colors.text,
    padding: '8px',
    borderRadius: '4px',
    marginBottom: '8px'
  };
  
  return (
    <div
      ref={cardRef}
      className={`class-card shadow-sm ${className || ''} cursor-move`}
      style={cardStyle}
      draggable="true"
    >
      <div className="font-medium">{title}</div>
      {(room || event?.room) && (
        <div className="text-xs opacity-75">
          Sala: {room || event?.room}
        </div>
      )}
      {(professor || event?.professor) && (
        <div className="text-xs opacity-75">
          Professor: {professor || event?.professor}
        </div>
      )}
      {event?.semester && (
        <div className="text-xs opacity-75">
          Semestre: {event.semester}
        </div>
      )}
      {event?.class && (
        <div className="text-xs opacity-75">
          Turma: {event.class}
        </div>
      )}
      {/* Mostrar a modalidade */}
      {type && (
        <div className="text-xs opacity-75 font-semibold">
          Modalidade: {type}
        </div>
      )}
      {roomInfo && <div className="text-xs mt-1 opacity-60">{roomInfo}</div>}
    </div>
  );
};

export default ClassCard;