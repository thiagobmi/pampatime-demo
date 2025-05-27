import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import ClassCard from './ClassCard';
import { Search } from 'lucide-react';
import { Draggable } from '@fullcalendar/interaction';

const ClassesPanel = () => {
  const draggableContainerRef = useRef(null);

  useEffect(() => {
    if (draggableContainerRef.current) {
      // Inicializa o Draggable do FullCalendar
      new Draggable(draggableContainerRef.current, {
        itemSelector: '.class-card',
        eventData: function(eventEl) {
          const eventData = eventEl.getAttribute('data-event');
          return eventData ? JSON.parse(eventData) : null;
        }
      });
    }
  }, []);

return (
  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col h-full min-h-0">
    <div className="relative mb-2 flex-shrink-0">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <input 
        type="text" 
        placeholder="Pesquisar" 
        className="pl-8 pr-10 py-2 w-full border rounded-lg text-sm"
      />
      <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7">
        <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
          <path d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM5 10.5C5 10.2239 5.22386 10 5.5 10H9.5C9.77614 10 10 10.2239 10 10.5C10 10.7761 9.77614 11 9.5 11H5.5C5.22386 11 5 10.7761 5 10.5Z" fill="currentColor"></path>
        </svg>
      </Button>
    </div>
      
      <div ref={draggableContainerRef} className="space-y-2 overflow-y-auto flex-1">
        <ClassCard 
          title="Cálculo I" 
          room="A101" 
          professor="Prof. Silva"
          type="calculus"
        />
        
        <ClassCard 
          title="Matemática Discreta" 
          room="B205" 
          professor="Prof. Oliveira"
          type="math"
        />
        
        <ClassCard 
          title="Algoritmos e Programação" 
          room="C310" 
          professor="Prof. Santos"
          type="algorithms"
        />
        
        <ClassCard 
          title="Estatística" 
          room="D104" 
          professor="Prof. Pereira"
          type="math"
        />
        
        <ClassCard 
          title="Práticas de Programação" 
          room="Lab 2" 
          professor="Prof. Costa"
          type="practices"
        />
        
        <ClassCard 
          title="Desafios de Algoritmos" 
          room="C208" 
          professor="Prof. Lima"
          type="challenges"
        />
      </div>
    </div>
  );
};

export default ClassesPanel;