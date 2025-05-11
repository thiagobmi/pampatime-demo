import React, { useRef, useEffect } from 'react';

interface ClassCardProps {
  title: string;
  room?: string;
  professor?: string;
  type: 'calculus' | 'math' | 'algorithms' | 'practices' | 'challenges';
  className?: string;
  roomInfo?: string;
  // Props para o draggable do FullCalendar
  event?: {
    title: string;
    duration?: string;
    backgroundColor?: string;
    borderColor?: string;
    extendedProps?: any;
  };
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
  
  // Cores de fundo pastel para cada tipo
  const cardColors = {
    calculus: '#d1fae5', // Verde pastel
    math: '#dbeafe', // Azul pastel
    algorithms: '#fef3c7', // Amarelo pastel
    practices: '#e9d5ff', // Púrpura pastel
    challenges: '#fecaca'  // Rosa pastel (mantido)
  };
  
  // Cores de borda mais escuras para cada tipo
  const borderColors = {
    calculus: '#10b981', // Verde mais escuro
    math: '#3b82f6', // Azul mais escuro
    algorithms: '#f59e0b', // Amarelo mais escuro
    practices: '#8b5cf6', // Púrpura mais escuro
    challenges: '#f87171'  // Rosa (mantido)
  };
  
  // Configuração do evento draggable
  const eventData = {
    title: title,
    duration: '01:00', // Duração padrão
    backgroundColor: cardColors[type],
    borderColor: borderColors[type],
    textColor: '#000000', // Cor do texto
    classNames: [cardClasses[type]], // Adiciona a classe ao evento
    extendedProps: {
      room,
      professor,
      type,
      roomInfo
    }
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
        backgroundColor: cardColors[type],
        borderLeft: `4px solid ${borderColors[type]}`,
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