
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ClassCard from './ClassCard';

const Timetable = () => {
  const timeSlots = [
    '8:30', '9:30', '10:30', '12:30', '13:30', '14:30', 
    '15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30'
  ];
  
  const weekDays = [
    { short: 'MON', full: 'Segunda', pt: 'Segunda' },
    { short: 'TUE', full: 'Tuesday', pt: 'Terça' },
    { short: 'WED', full: 'Wednesday', pt: 'Quarta' },
    { short: 'THU', full: 'Thursday', pt: 'Quinta' },
    { short: 'FRI', full: 'Friday', pt: 'Sexta' },
    { short: 'SAT', full: 'Saturday', pt: 'Sábado' },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">A1-202</span>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white">Professor</Button>
          <Button variant="outline" className="bg-white">Semestre</Button>
          <Button variant="outline" className="bg-pampa-green text-white hover:bg-pampa-green/90">Sala</Button>
          <Button variant="outline" className="bg-white">Curso</Button>
        </div>
      </div>
      
      <div className="min-w-[900px]">
        {/* Header with days */}
        <div className="grid grid-cols-7 border-b">
          <div className="p-2 text-center border-r font-medium text-xs">
            <div>EST</div>
            <div>GMT-5</div>
          </div>
          
          {weekDays.map((day) => (
            <div key={day.short} className="p-2 text-center border-r">
              <div className="text-xs text-gray-500">{day.short}</div>
              <div className="font-medium">{day.pt}</div>
            </div>
          ))}
        </div>
        
        {/* Time slots and classes */}
        <div className="relative">
          {timeSlots.map((time, index) => (
            <div key={time} className="grid grid-cols-7 border-b">
              <div className="p-2 text-center border-r text-sm">{time}</div>
              <div className="border-r min-h-[40px]">
                {index === 11 && (
                  <ClassCard 
                    title="Práticas de Interação"
                    type="practices"
                    roomInfo="A1-202 - Williamson Silva"
                    className="h-full"
                  />
                )}
              </div>
              <div className="border-r min-h-[40px]"></div>
              <div className="border-r min-h-[40px]"></div>
              <div className="border-r min-h-[40px]">
                {index === 11 && (
                  <ClassCard 
                    title="Desafios de Programação"
                    type="challenges"
                    roomInfo="A1-202 - Marcelo Caggiani"
                    className="h-full"
                  />
                )}
              </div>
              <div className="border-r min-h-[40px]"></div>
              <div className="min-h-[40px]"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
