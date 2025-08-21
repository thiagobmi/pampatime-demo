import React, { forwardRef, useImperativeHandle, useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { EventCalendar } from './EventCalendar';
import { getEventTypeColors } from '@/types/Event';
import { getAcademicData } from '@/utils/academicDataUtils';

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

  // Navegação pelos valores
  const navigatePrevious = () => {
    if (currentOptions.length === 0) return;
    
    if (currentValue === '') {
      // Se nenhum valor selecionado, vai para o último
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: currentOptions[currentOptions.length - 1]
      }));
    } else if (currentIndex > 0) {
      // Vai para o anterior
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: currentOptions[currentIndex - 1]
      }));
    } else {
      // Se já está no primeiro, remove a seleção
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: ''
      }));
    }
  };

  const navigateNext = () => {
    if (currentOptions.length === 0) return;
    
    if (currentValue === '') {
      // Se nenhum valor selecionado, vai para o primeiro
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: currentOptions[0]
      }));
    } else if (currentIndex < currentOptions.length - 1) {
      // Vai para o próximo
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: currentOptions[currentIndex + 1]
      }));
    } else {
      // Se já está no último, remove a seleção
      setSelectedValues(prev => ({
        ...prev,
        [activeFilterType]: ''
      }));
    }
  };

  // Eventos filtrados
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filtro por termo de pesquisa
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.professor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.room?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtros por valores selecionados
      const matchesProfessor = !selectedValues.professor || event.professor === selectedValues.professor;
      const matchesSala = !selectedValues.sala || event.room === selectedValues.sala;
      const matchesSemestre = !selectedValues.semestre || event.semester === selectedValues.semestre;

      return matchesSearch && matchesProfessor && matchesSala && matchesSemestre;
    });
  }, [events, searchTerm, selectedValues]);

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
    
    if (onEventClick) {
      onEventClick(eventData);
    }
  };

  const handleEventDrop = (info: any) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === info.event.id 
          ? {
              ...event,
              start: info.event.start,
              end: info.event.end
            }
          : event
      );
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    if (selectedEventId === info.event.id && onEventChange) {
      const updatedEventData = createEventDataFromFullCalendar(info.event);
      onEventChange(updatedEventData);
    }
  };

  const handleEventResize = (info: any) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === info.event.id 
          ? {
              ...event,
              start: info.event.start,
              end: info.event.end
            }
          : event
      );
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    if (selectedEventId === info.event.id && onEventChange) {
      const updatedEventData = createEventDataFromFullCalendar(info.event);
      onEventChange(updatedEventData);
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
    const colors = getEventTypeColors(eventData.extendedProps?.type || '');
    
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
      backgroundColor: colors.bg,
      borderColor: colors.border,
    };

    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newEvent];
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });

    if (onEventClick) {
      setTimeout(() => {
        onEventClick(newEvent);
      }, 100);
    }
  };

  // Function to add event from form
  const addEvent = (event: Event) => {
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, event];
      notifyEventsChange(updatedEvents);
      return updatedEvents;
    });
  };

  // Function to update event
  const updateEvent = (updatedEvent: Event) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
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
      {hasActiveFilters && (
        <div className="px-2 py-1 bg-blue-50 border-b border-blue-200 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              Exibindo {filteredEvents.length} de {events.length} eventos
            </span>
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
            events={filteredEvents}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            onEventReceive={handleEventReceive}
          />
        </div>
      </div>
    </div>
  );
});

Timetable.displayName = 'Timetable';

export default Timetable;