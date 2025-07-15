// src/components/ClassCard.tsx
import React, { useRef, useEffect } from 'react';
import { getEventTypeColors } from '@/types/Event';

interface ClassCardProps {
  title: string;
  room?: string;
  professor?: string;
  type: string;
  className?: string;
  roomInfo?: string;
  event?: any;
}

const ClassCard: React.FC<ClassCardProps> = ({
  title,
  room,
  professor,
  type,
  className,
  roomInfo,
  event
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Generate colors dynamically based on type
  const colors = getEventTypeColors(type);
  
  // Create event data for FullCalendar dragging
  const eventData = {
    title: title,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    textColor: colors.text,
    extendedProps: {
      room: room,
      professor: professor,
      type: type,
      ...event?.extendedProps
    }
  };
  
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.setAttribute('data-event', JSON.stringify(eventData));
    }
  }, [title, room, professor, type, roomInfo, colors]);
  
  // Card styles with dynamic colors
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
      {room && <div className="text-xs opacity-75">Sala: {room}</div>}
      {professor && <div className="text-xs opacity-75">Professor: {professor}</div>}
      {roomInfo && <div className="text-xs mt-1 opacity-60">{roomInfo}</div>}
    </div>
  );
};

export default ClassCard;