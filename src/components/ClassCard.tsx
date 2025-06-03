// src/components/ClassCard.tsx
import React, { useRef, useEffect } from 'react';
import { Event, getEventTypeColors } from '@/types/Event';

interface ClassCardProps {
  title: string;
  room?: string;
  professor?: string;
  type: 'calculus' | 'math' | 'algorithms' | 'practices' | 'challenges';
  className?: string;
  roomInfo?: string;
  // Props para o draggable do FullCalendar
  event?: Partial<Event>;
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
  
  const cardClasses = {
    calculus: 'class-card-calculus',
    math: 'class-card-math',
    algorithms: 'class-card-algorithms',
    practices: 'class-card-practices',
    challenges: 'class-card-challenges'
  };
  
  // Get colors using the unified color system
  const colors = getEventTypeColors(type);
  
  // Configuração do evento draggable
  const eventData: Partial<Event> = {
    title: title,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    textColor: '#000000',
    extendedProps: {
      room,
      professor,
      type,
      roomInfo
    },
    ...event // Allow override with any passed event data
  };
  
  useEffect(() => {
    if (cardRef.current) {
      // Adiciona o atributo data-event ao elemento
      cardRef.current.setAttribute('data-event', JSON.stringify(eventData));
    }
  }, [eventData, title, room, professor, type, roomInfo]);
  
  return (
    <div
      ref={cardRef}
      className={`class-card ${cardClasses[type]} shadow-sm ${className || ''} cursor-move`}
      style={{
        backgroundColor: colors.bg,
        borderLeft: `4px solid ${colors.border}`,
        padding: '8px',
        borderRadius: '4px',
        marginBottom: '8px'
      }}
      draggable="true"
    >
      <div className="font-medium">{title}</div>
      {room && <div className="text-xs text-gray-700">Sala: {room}</div>}
      {professor && <div className="text-xs text-gray-700">Professor: {professor}</div>}
      {roomInfo && <div className="text-xs mt-1 text-gray-600">{roomInfo}</div>}
    </div>
  );
};

export default ClassCard;