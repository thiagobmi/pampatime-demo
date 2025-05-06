
import React from 'react';

interface ClassCardProps {
  title: string;
  room?: string;
  professor?: string;
  type: 'calculus' | 'math' | 'algorithms' | 'practices' | 'challenges';
  className?: string;
  roomInfo?: string;
}

const ClassCard: React.FC<ClassCardProps> = ({ 
  title, 
  room, 
  professor, 
  type, 
  className,
  roomInfo
}) => {
  const cardClasses = {
    calculus: 'class-card-calculus',
    math: 'class-card-math',
    algorithms: 'class-card-algorithms',
    practices: 'class-card-practices',
    challenges: 'class-card-challenges'
  };

  return (
    <div className={`class-card ${cardClasses[type]} shadow-sm ${className}`}>
      <div className="font-medium">{title}</div>
      {room && <div className="text-xs text-gray-700">Sala: {room}</div>}
      {professor && <div className="text-xs text-gray-700">Professor: {professor}</div>}
      {roomInfo && <div className="text-xs mt-1 text-gray-600">{roomInfo}</div>}
    </div>
  );
};

export default ClassCard;
