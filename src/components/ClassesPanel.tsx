// src/components/ClassesPanel.tsx
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import ClassCard from './ClassCard';
import { Search } from 'lucide-react';
import { Draggable } from '@fullcalendar/interaction';
import { Event } from '@/types/Event';

interface ClassesPanelProps {
  existingEvents: Event[];
}

const ClassesPanel: React.FC<ClassesPanelProps> = ({ existingEvents }) => {
  const draggableContainerRef = useRef(null);
  const [searchTerm, setSearchTerm] = React.useState('');

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

  // Agrupar eventos únicos por título (disciplina)
  const uniqueEvents = React.useMemo(() => {
    const eventMap = new Map<string, Event>();
    
    existingEvents.forEach(event => {
      // Usar o título como chave para manter apenas disciplinas únicas
      if (!eventMap.has(event.title)) {
        eventMap.set(event.title, event);
      }
    });
    
    return Array.from(eventMap.values());
  }, [existingEvents]);

  // Filtrar eventos baseado na pesquisa
  const filteredEvents = React.useMemo(() => {
    if (!searchTerm) return uniqueEvents;
    
    const searchLower = searchTerm.toLowerCase();
    return uniqueEvents.filter(event => 
      event.title.toLowerCase().includes(searchLower) ||
      event.professor?.toLowerCase().includes(searchLower) ||
      event.room?.toLowerCase().includes(searchLower) ||
      event.type?.toLowerCase().includes(searchLower)
    );
  }, [uniqueEvents, searchTerm]);

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col h-full min-h-0">
      <div className="flex-shrink-0 mb-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Disciplinas no Calendário ({uniqueEvents.length})
        </h3>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Pesquisar disciplinas..." 
            className="pl-8 pr-10 py-2 w-full border rounded-lg text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchTerm('')}
          >
            <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
              <path d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM5 10.5C5 10.2239 5.22386 10 5.5 10H9.5C9.77614 10 10 10.2239 10 10.5C10 10.7761 9.77614 11 9.5 11H5.5C5.22386 11 5 10.7761 5 10.5Z" fill="currentColor"></path>
            </svg>
          </Button>
        </div>
      </div>
        
      <div ref={draggableContainerRef} className="space-y-2 overflow-y-auto flex-1">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <ClassCard 
              key={`draggable-${event.id}`}
              title={event.title}
              room={event.room}
              professor={event.professor}
              type={event.type || ''}
              event={event}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? (
              <div>
                <p className="text-sm mb-2">Nenhuma disciplina encontrada</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Limpar pesquisa
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-2">Nenhuma disciplina no calendário</p>
                <p className="text-xs">Adicione disciplinas usando o formulário acima</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {filteredEvents.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Arraste para duplicar no calendário
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassesPanel;