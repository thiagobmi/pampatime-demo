import React, { forwardRef, useImperativeHandle, useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { EventCalendar } from './EventCalendar';
import { getEventTypeColors, applyEventColors, CONFLICT_COLORS } from '@/types/Event';
import { getAcademicData } from '@/utils/academicDataUtils';

interface ConflictInfo {
  eventId: string | number;
  conflictType: 'sala' | 'professor' | 'semestre';
  conflictValue: string;
  conflictWith: string | number;
}

interface Event {
  id?: string | number;
  title: string;
  start?: Date | string;
  end?: Date | string;
  room?: string;
  professor?: string;
  semester?: string;
  class?: string;
  type?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  className?: string;
  conflictInfo?: ConflictInfo[];
}

interface TimetableProps {
  onEventClick?: (event: Event) => void;
  onEventChange?: (event: Event) => void;
  onEventsChange?: (events: Event[]) => void;
}

interface TimetableRef {
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string | number) => void;
  getEvents: () => Event[];
}

type FilterType = 'professor' | 'semestre' | 'sala';

const Timetable = forwardRef<TimetableRef, TimetableProps>(({ onEventClick, onEventChange, onEventsChange }, ref) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados dos filtros
  const [activeFilterType, setActiveFilterType] = useState<FilterType>('professor');
  const [selectedValues, setSelectedValues] = useState<Record<FilterType, string>>({
    professor: '',
    semestre: '',
    sala: ''
  });
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchModalTerm, setSearchModalTerm] = useState('');

  // Dados acadêmicos do JSON
  const academicData = getAcademicData();

  // Função para detectar conflitos de horários com informações detalhadas
  const detectConflicts = React.useCallback((events: Event[]) => {
    const conflictIds = new Set<string | number>();
    const conflictDetails = new Map<string | number, ConflictInfo[]>();
    
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];
        
        if (!event1.start || !event2.start || !event1.end || !event2.end || !event1.id || !event2.id) continue;
        
        const start1 = new Date(event1.start);
        const end1 = new Date(event1.end);
        const start2 = new Date(event2.start);
        const end2 = new Date(event2.end);
        
        // Verificar se são no mesmo dia e há sobreposição
        const sameDay = start1.toDateString() === start2.toDateString();
        const hasTimeOverlap = sameDay && (start1 < end2) && (start2 < end1);
        
        if (hasTimeOverlap) {
          const conflicts: ConflictInfo[] = [];
          
          // Conflito de sala
          if (event1.room && event2.room && event1.room === event2.room) {
            conflicts.push(
              {
                eventId: event1.id,
                conflictType: 'sala',
                conflictValue: event1.room,
                conflictWith: event2.id
              },
              {
                eventId: event2.id,
                conflictType: 'sala',
                conflictValue: event2.room,
                conflictWith: event1.id
              }
            );
          }
          
          // Conflito de professor
          if (event1.professor && event2.professor && event1.professor === event2.professor) {
            conflicts.push(
              {
                eventId: event1.id,
                conflictType: 'professor',
                conflictValue: event1.professor,
                conflictWith: event2.id
              },
              {
                eventId: event2.id,
                conflictType: 'professor',
                conflictValue: event2.professor,
                conflictWith: event1.id
              }
            );
          }
          
          // Conflito de semestre - disciplinas diferentes do mesmo semestre com sobreposição
          if (event1.semester && event2.semester && 
              event1.semester.trim() === event2.semester.trim() && 
              event1.title !== event2.title) {
            conflicts.push(
              {
                eventId: event1.id,
                conflictType: 'semestre',
                conflictValue: event1.semester,
                conflictWith: event2.id
              },
              {
                eventId: event2.id,
                conflictType: 'semestre',
                conflictValue: event2.semester,
                conflictWith: event1.id
              }
            );
          }
          
          if (conflicts.length > 0) {
            conflictIds.add(event1.id);
            conflictIds.add(event2.id);
            
            conflicts.forEach(conflict => {
              const existing = conflictDetails.get(conflict.eventId) || [];
              existing.push(conflict);
              conflictDetails.set(conflict.eventId, existing);
            });
          }
        }
      }
    }
    
    return { conflictIds, conflictDetails };
  }, []);

  // Detectar conflitos nos eventos atuais
  const conflictData = useMemo(() => {
    return detectConflicts(events);
  }, [events, detectConflicts]);

  // Opções para cada tipo de filtro baseadas no JSON
  const filterOptions = useMemo(() => {
    return {
      professor: academicData.professores.map(prof => prof.nome).sort(),
      semestre: academicData.semestres.map(sem => sem.codigo).sort(),
      sala: academicData.salas.map(sala => sala.codigo).sort()
    };
  }, [academicData]);

  // Valor atualmente selecionado para o filtro ativo
  const currentValue = selectedValues[activeFilterType];
  const currentOptions = filterOptions[activeFilterType];
  const currentIndex = currentOptions.indexOf(currentValue);

  // Opções filtradas para o modal de pesquisa
  const filteredModalOptions = useMemo(() => {
    if (!searchModalTerm) return currentOptions;
    return currentOptions.filter(option =>
      option.toLowerCase().includes(searchModalTerm.toLowerCase())
    );
  }, [currentOptions, searchModalTerm]);

  // Função para gerar texto descritivo dos conflitos
  const getConflictDescription = (conflictInfo: ConflictInfo[]): string => {
    if (!conflictInfo || conflictInfo.length === 0) return '';
    
    const conflictsByType = conflictInfo.reduce((acc, conflict) => {
      if (!acc[conflict.conflictType]) {
        acc[conflict.conflictType] = new Set();
      }
      acc[conflict.conflictType].add(conflict.conflictValue);
      return acc;
    }, {} as Record<string, Set<string>>);
    
    const descriptions = [];
    
    if (conflictsByType.sala) {
      const salas = Array.from(conflictsByType.sala);
      descriptions.push(`Sala ${salas.join(', ')} ocupada`);
    }
    
    if (conflictsByType.professor) {
      const professores = Array.from(conflictsByType.professor);
      descriptions.push(`Prof. ${professores.join(', ')} em conflito`);
    }
    
    if (conflictsByType.semestre) {
      const semestres = Array.from(conflictsByType.semestre);
      descriptions.push(`Semestre ${semestres.join(', ')} sobreposto`);
    }
    
    return descriptions.join(' • ');
  };

  // Navegação pelos valores
  const navigatePrevious = () => {
    if (currentOptions.length === 0) return;
    
    if (currentValue === '') {
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: currentOptions[currentOptions.length - 1]
      }));
    } else if (currentIndex > 0) {
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: currentOptions[currentIndex - 1]
      }));
    } else {
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: ''
      }));
    }
  };

  const navigateNext = () => {
    if (currentOptions.length === 0) return;
    
    if (currentValue === '') {
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: currentOptions[0]
      }));
    } else if (currentIndex < currentOptions.length - 1) {
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: currentOptions[currentIndex + 1]
      }));
    } else {
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: ''
      }));
    }
  };

  // Eventos filtrados
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.professor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.room?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProfessor = !selectedValues.professor || event.professor === selectedValues.professor;
      const matchesSala = !selectedValues.sala || event.room === selectedValues.sala;
      const matchesSemestre = !selectedValues.semestre || event.semester === selectedValues.semestre;

      return matchesSearch && matchesProfessor && matchesSala && matchesSemestre;
    });
  }, [events, searchTerm, selectedValues]);

  // Aplicar estilos de conflito aos eventos - CORRIGIDO
  const styledFilteredEvents = useMemo(() => {
    return filteredEvents.map(event => {
      if (event.id && conflictData.conflictIds.has(event.id)) {
        // Para eventos em conflito, usar cores vermelhas
        const eventConflicts = conflictData.conflictDetails.get(event.id) || [];
        return {
          ...event,
          backgroundColor: CONFLICT_COLORS.bg,
          borderColor: CONFLICT_COLORS.border,
          textColor: CONFLICT_COLORS.text,
          className: 'conflict-event',
          conflictInfo: eventConflicts
        };
      }
      
      // Para eventos sem conflito, usar cores baseadas na modalidade
      const colors = getEventTypeColors(event.type || '');
      return {
        ...event,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: colors.text,
        className: '',
        conflictInfo: undefined
      };
    });
  }, [filteredEvents, conflictData]);

  // Agrupar conflitos por tipo para exibição
  const conflictSummary = useMemo(() => {
    const summary = { sala: new Set<string>(), professor: new Set<string>(), semestre: new Set<string>() };
    
    conflictData.conflictDetails.forEach((conflicts) => {
      conflicts.forEach((conflict) => {
        summary[conflict.conflictType].add(conflict.conflictValue);
      });
    });
    
    return {
      sala: Array.from(summary.sala),
      professor: Array.from(summary.professor),
      semestre: Array.from(summary.semestre),
      total: conflictData.conflictIds.size
    };
  }, [conflictData]);

  // Notify parent when events change
  const notifyEventsChange = (newEvents: Event[]) => {
    if (onEventsChange) {
      onEventsChange(newEvents);
    }
  };

  // Helper function to create event data from FullCalendar event
  const createEventDataFromFullCalendar = (fcEvent: any): Event => {
    return {
      id: fcEvent.id,
      title: fcEvent.title,
      start: fcEvent.start,
      end: fcEvent.end,
      room: fcEvent.extendedProps?.room,
      professor: fcEvent.extendedProps?.professor,
      semester: fcEvent.extendedProps?.semester,
      class: fcEvent.extendedProps?.class,
      type: fcEvent.extendedProps?.type,
      backgroundColor: fcEvent.backgroundColor,
      borderColor: fcEvent.borderColor,
    };
  };

  // Handle event click
  const handleEventClick = (info: any) => {
    const eventData = createEventDataFromFullCalendar(info.event);
    setSelectedEventId(eventData.id);
    
    // Verificar se há conflitos e mostrar alerta
    if (eventData.id && conflictData.conflictDetails.has(eventData.id)) {
      const conflicts = conflictData.conflictDetails.get(eventData.id) || [];
      const conflictDesc = getConflictDescription(conflicts);
      if (conflictDesc) {
        setTimeout(() => {
          alert(`⚠️ CONFLITO DETECTADO:\n\n${conflictDesc}\n\nClique em "Editar" para resolver o conflito.`);
        }, 100);
      }
    }
    
    if (onEventClick) {
      onEventClick(eventData);
    }
  };

  // FIXED: Handle event drop with immediate sync
  const handleEventDrop = (info: any) => {
    // Criar o evento atualizado com as cores corretas da modalidade
    const updatedEventData = createEventDataFromFullCalendar(info.event);
    const recoloredEvent = applyEventColors(updatedEventData);
    
    // Atualizar o evento com os novos horários
    const finalEvent = {
      ...recoloredEvent,
      start: info.event.start,
      end: info.event.end
    };
    
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === info.event.id ? finalEvent : event
      );
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    // CRITICAL FIX: Notify parent immediately if this is the selected event
    if (selectedEventId === info.event.id && onEventChange) {
      // Use setTimeout to ensure the state update happens after the calendar update
      setTimeout(() => {
        onEventChange(finalEvent);
      }, 0);
    }
  };

  // FIXED: Handle event resize with immediate sync
  const handleEventResize = (info: any) => {
    // Criar o evento redimensionado com as cores corretas da modalidade
    const resizedEventData = createEventDataFromFullCalendar(info.event);
    const recoloredEvent = applyEventColors(resizedEventData);
    
    // Atualizar o evento com os novos horários
    const finalEvent = {
      ...recoloredEvent,
      start: info.event.start,
      end: info.event.end
    };
    
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === info.event.id ? finalEvent : event
      );
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    // CRITICAL FIX: Notify parent immediately if this is the selected event
    if (selectedEventId === info.event.id && onEventChange) {
      // Use setTimeout to ensure the state update happens after the calendar update
      setTimeout(() => {
        onEventChange(finalEvent);
      }, 0);
    }
  };

  const handleEventReceive = (info: any) => {
    const eventData = {
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || new Date(info.event.start.getTime() + 60*60*1000),
      extendedProps: info.event.extendedProps || {}
    };
    
    info.event.remove();
    
    const newEventId = `event-${Date.now()}-${Math.random()}`;
    
    const newEvent: Event = {
      id: newEventId,
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      room: eventData.extendedProps?.room || '',
      professor: eventData.extendedProps?.professor || '',
      semester: eventData.extendedProps?.semester || '',
      class: eventData.extendedProps?.class || '',
      type: eventData.extendedProps?.type || '',
    };

    // Aplicar cores baseadas na modalidade
    const coloredEvent = applyEventColors(newEvent);

    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, coloredEvent];
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    if (onEventClick) {
      setTimeout(() => {
        onEventClick(coloredEvent);
      }, 100);
    }
  };

  // Function to add event from form
  const addEvent = (event: Event) => {
    // Garantir que o evento tem as cores corretas baseadas na modalidade
    const coloredEvent = applyEventColors(event);
    
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, coloredEvent];
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });
  };

  // Function to update event
  const updateEvent = (updatedEvent: Event) => {
    // Garantir que o evento atualizado tem as cores corretas baseadas na modalidade
    const coloredEvent = applyEventColors(updatedEvent);
    
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === updatedEvent.id ? coloredEvent : event
      );
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });
  };

  // Function to delete event
  const deleteEvent = (eventId: string | number) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.filter(event => event.id !== eventId);
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });
    
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
    }
  };

  // Function to get current events
  const getEvents = () => {
    return events;
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedValues({
      professor: '',
      semestre: '',
      sala: ''
    });
    setSearchTerm('');
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(selectedValues).some(value => value !== '') || searchTerm;

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    addEvent,
    updateEvent,
    deleteEvent,
    getEvents
  }));

  // Helper function to get display text for filter navigation
  const getNavigationDisplayText = () => {
    if (currentValue === '') {
      return `Selecione ${activeFilterType}`;
    }
    
    const position = currentIndex + 1;
    const total = currentOptions.length;
    return `${currentValue} (${position}/${total})`;
  };

  // Handle search modal
  const openSearchModal = () => {
    setSearchModalTerm('');
    setShowSearchModal(true);
  };

  const closeSearchModal = () => {
    setShowSearchModal(false);
    setSearchModalTerm('');
  };

  const selectFromModal = (value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [activeFilterType]: value
    }));
    closeSearchModal();
  };

  // Close modal when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.getElementById('search-modal');
      if (modal && !modal.contains(event.target as Node)) {
        closeSearchModal();
      }
    };

    if (showSearchModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearchModal]);

  return (
    <>
      {/* Estilos CSS para conflitos */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .conflict-event {
            animation: pulse-red 2s infinite;
          }
          
          @keyframes pulse-red {
            0%, 100% {
              box-shadow: 0 0 0 2px #dc2626;
            }
            50% {
              box-shadow: 0 0 0 4px #dc2626;
            }
          }
          
          .fc-event.conflict-event {
            border: 2px solid #dc2626 !important;
            background-color: #fee2e2 !important;
            color: #7f1d1d !important;
          }
          
          .fc-event.conflict-event:hover {
            background-color: #fecaca !important;
          }
          
          .fc-event.conflict-event::after {
            content: "⚠";
            position: absolute;
            top: 2px;
            right: 2px;
            color: #dc2626;
            font-weight: bold;
            font-size: 12px;
            text-shadow: 0 0 2px white;
          }
        `
      }} />
      
      <div className="w-full h-full flex flex-col border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="flex items-center justify-between p-2 border-b">
          {/* Navegação com setas */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={navigatePrevious}
              disabled={currentOptions.length === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="min-w-[180px] text-center relative">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                {activeFilterType.charAt(0).toUpperCase() + activeFilterType.slice(1)}
              </div>
              <div 
                className="font-medium text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                onClick={openSearchModal}
                title="Clique para pesquisar"
              >
                {getNavigationDisplayText()}
              </div>
              
              {/* Modal de pesquisa */}
              {showSearchModal && (
                <div 
                  id="search-modal"
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                >
                  <div className="p-3 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Pesquisar {activeFilterType}
                    </div>
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder={`Digite para buscar ${activeFilterType}...`}
                        value={searchModalTerm}
                        onChange={(e) => setSearchModalTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {currentValue && (
                      <div
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-red-50 border-b border-gray-100 text-red-600"
                        onClick={() => selectFromModal('')}
                      >
                        <div className="font-medium flex items-center">
                          <X size={14} className="mr-2" />
                          Limpar seleção
                        </div>
                      </div>
                    )}
                    
                    {filteredModalOptions.length > 0 ? (
                      filteredModalOptions.map((option, index) => (
                        <div
                          key={index}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                            currentValue === option ? 'bg-blue-100 text-blue-800' : ''
                          }`}
                          onClick={() => selectFromModal(option)}
                        >
                          <div className="font-medium">{option}</div>
                          {activeFilterType === 'professor' && (
                            (() => {
                              const prof = academicData.professores.find(p => p.nome === option);
                              return prof ? (
                                <div className="text-xs text-gray-500">
                                  {prof.departamento} - {prof.especialidade}
                                </div>
                              ) : null;
                            })()
                          )}
                          {activeFilterType === 'sala' && (
                            (() => {
                              const sala = academicData.salas.find(s => s.codigo === option);
                              return sala ? (
                                <div className="text-xs text-gray-500">
                                  {sala.tipo} - Bloco {sala.bloco}, {sala.andar}º andar
                                </div>
                              ) : null;
                            })()
                          )}
                          {activeFilterType === 'semestre' && (
                            (() => {
                              const semestre = academicData.semestres.find(s => s.codigo === option);
                              return semestre ? (
                                <div className="text-xs text-gray-500">
                                  {semestre.nome}
                                </div>
                              ) : null;
                            })()
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        <Search size={16} className="mx-auto mb-2" />
                        Nenhum resultado encontrado para "{searchModalTerm}"
                      </div>
                    )}
                  </div>
                  
                  {filteredModalOptions.length > 0 && (
                    <div className="px-3 py-2 border-t border-gray-200 text-xs text-gray-500 text-center">
                      {filteredModalOptions.length} de {currentOptions.length} opções
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={navigateNext}
              disabled={currentOptions.length === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Botões de seleção de tipo de filtro */}
          <div className="flex items-center divide-x divide-gray-200 rounded-md overflow-hidden border border-gray-300">
            <Button
              variant="outline"
              className={`text-sm h-8 rounded-none border-none px-4 ${
                activeFilterType === 'professor' 
                  ? 'bg-pampa-green text-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => setActiveFilterType('professor')}
            >
              Professor
            </Button>
            <Button
              variant="outline"
              className={`text-sm h-8 rounded-none border-none px-4 ${
                activeFilterType === 'semestre' 
                  ? 'bg-pampa-green text-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => setActiveFilterType('semestre')}
            >
              Semestre
            </Button>
            <Button
              variant="outline"
              className={`text-sm h-8 rounded-none border-none px-4 ${
                activeFilterType === 'sala' 
                  ? 'bg-pampa-green text-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => setActiveFilterType('sala')}
            >
              Sala
            </Button>
          </div>
          
          {/* Campo de pesquisa e botão limpar */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-8 py-1 w-full border rounded-md text-xs min-w-[140px]"
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-1"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs h-8 px-2"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Indicador de filtros ativos */}
        {(hasActiveFilters || conflictSummary.total > 0) && (
          <div className="px-2 py-1 bg-blue-50 border-b border-blue-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-blue-700">
                  Exibindo {filteredEvents.length} de {events.length} eventos
                </span>
                
                {conflictSummary.total > 0 && (
                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium flex items-center space-x-2">
                    <span>⚠️ {conflictSummary.total} eventos com conflito</span>
                    <div className="text-xs opacity-75">
                      {conflictSummary.sala.length > 0 && (
                        <span className="bg-red-200 px-1 rounded mr-1">
                          🏢 {conflictSummary.sala.length} sala{conflictSummary.sala.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {conflictSummary.professor.length > 0 && (
                        <span className="bg-red-200 px-1 rounded mr-1">
                          👨‍🏫 {conflictSummary.professor.length} prof{conflictSummary.professor.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {conflictSummary.semestre.length > 0 && (
                        <span className="bg-red-200 px-1 rounded">
                          📅 {conflictSummary.semestre.length} sem{conflictSummary.semestre.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedValues.professor && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center">
                    Prof: {selectedValues.professor}
                    <X 
                      size={12} 
                      className="ml-1 cursor-pointer hover:bg-blue-200 rounded" 
                      onClick={() => setSelectedValues(prev => ({ ...prev, professor: '' }))}
                    />
                  </span>
                )}
                {selectedValues.sala && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center">
                    Sala: {selectedValues.sala}
                    <X 
                      size={12} 
                      className="ml-1 cursor-pointer hover:bg-green-200 rounded" 
                      onClick={() => setSelectedValues(prev => ({ ...prev, sala: '' }))}
                    />
                  </span>
                )}
                {selectedValues.semestre && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs flex items-center">
                    Sem: {selectedValues.semestre}
                    <X 
                      size={12} 
                      className="ml-1 cursor-pointer hover:bg-purple-200 rounded" 
                      onClick={() => setSelectedValues(prev => ({ ...prev, semestre: '' }))}
                    />
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs flex items-center">
                    "{searchTerm}"
                    <X 
                      size={12} 
                      className="ml-1 cursor-pointer hover:bg-gray-200 rounded" 
                      onClick={() => setSearchTerm('')}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full">
            <EventCalendar 
              events={styledFilteredEvents}
              onEventClick={handleEventClick}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              onEventReceive={handleEventReceive}
            />
          </div>
        </div>
      </div>
    </>
  );
});

Timetable.displayName = 'Timetable';

export default Timetable;