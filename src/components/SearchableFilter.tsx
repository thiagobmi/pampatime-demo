// src/components/SearchableFilter.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import academicData from '@/data/academicData.json';
import type { AcademicData, FilterOption } from '@/types/AcademicData';

interface SearchableFilterProps {
  label: string;
  options?: string[];
  onSelect: (value: string, id?: string) => void;
  className?: string;
  value?: string;
}

const SearchableFilter: React.FC<SearchableFilterProps> = ({ 
  label, 
  options = [], 
  onSelect, 
  className = "",
  value = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(value);
  const [selectedId, setSelectedId] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update selectedValue when value prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Função para obter opções baseadas no label
  const getOptionsFromData = (): FilterOption[] => {
    const data = academicData as AcademicData;
    
    // Se tem options passadas como prop (para horário final filtrado), usar essas
    if (options.length > 0 && label === 'Horário Final') {
      return options.map((hora, index) => {
        const horario = data.horarios.find(h => h.hora === hora);
        return {
          id: horario?.id || `hora_${index}`,
          display: hora,
          searchText: hora.toLowerCase(),
          additionalInfo: horario?.periodo || ''
        };
      });
    }
    
    switch (label) {
      case 'Professor':
        return data.professores.map(prof => ({
          id: prof.id,
          display: prof.nome,
          searchText: `${prof.nome} ${prof.departamento} ${prof.especialidade}`.toLowerCase(),
          additionalInfo: `${prof.departamento} - ${prof.especialidade}`
        }));
        
      case 'Semestre':
        return data.semestres.map(sem => ({
          id: sem.id,
          display: sem.codigo,
          searchText: `${sem.codigo} ${sem.nome}`.toLowerCase(),
          additionalInfo: sem.nome
        }));
        
      case 'Horário Início':
      case 'Horário Final':
        return data.horarios.map(hor => ({
          id: hor.id,
          display: hor.hora,
          searchText: `${hor.hora} ${hor.periodo}`.toLowerCase(),
          additionalInfo: hor.periodo
        }));
        
      case 'Sala':
        return data.salas.map(sala => ({
          id: sala.id,
          display: sala.codigo,
          searchText: `${sala.codigo} ${sala.nome} ${sala.tipo} ${sala.bloco}`.toLowerCase(),
          additionalInfo: `${sala.tipo} - Capacidade: ${sala.capacidade}`
        }));
        
      case 'Dia':
        return data.dias.map(dia => ({
          id: dia.id,
          display: dia.nome,
          searchText: `${dia.nome} ${dia.nomeCompleto}`.toLowerCase(),
          additionalInfo: dia.nomeCompleto
        }));
        
      case 'Turma':
        return data.turmas.map(turma => ({
          id: turma.id,
          display: turma.codigo,
          searchText: `${turma.codigo} ${turma.nome} ${turma.curso}`.toLowerCase(),
          additionalInfo: turma.curso
        }));
        
      case 'Modalidade':
        return data.tipos.filter(tipo => tipo.categoria === 'Modalidade').map(tipo => ({
          id: tipo.id,
          display: tipo.nome,
          searchText: `${tipo.nome}`.toLowerCase(),
          additionalInfo: 'Modalidade de Ensino'
        }));
        
      case 'Disciplina':
        // Para o campo "Disciplina", mostrar APENAS os nomes das disciplinas
        return data.disciplinas.map(disc => ({
          id: disc.id,
          display: disc.nome,
          searchText: `${disc.nome} ${disc.codigo} ${disc.tipo}`.toLowerCase(),
          additionalInfo: `${disc.codigo} - ${disc.tipo}`,
          tipo: 'nome' as const
        }));
        
      case 'Código Disciplina':
        // Para o campo "Código Disciplina", mostrar APENAS os códigos
        return data.disciplinas.map(disc => ({
          id: disc.id,
          display: disc.codigo,
          searchText: `${disc.codigo} ${disc.nome} ${disc.tipo}`.toLowerCase(),
          additionalInfo: `${disc.nome} - ${disc.tipo}`,
          tipo: 'codigo' as const
        }));
        
      default:
        return [];
    }
  };

  const currentOptions = getOptionsFromData();
  
  // Filter options based on search term
  const filteredOptions = currentOptions.filter(option =>
    option.searchText.includes(searchTerm.toLowerCase()) ||
    option.display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option: FilterOption) => {
    setSelectedValue(option.display);
    setSelectedId(option.id);
    setSearchTerm('');
    setIsOpen(false);
    if (onSelect) {
      onSelect(option.display, option.id);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue('');
    setSelectedId('');
    setSearchTerm('');
    if (onSelect) {
      onSelect('', '');
    }
  };

  // Função para obter informações adicionais baseada no label e valor selecionado
  const getAdditionalInfo = (): string => {
    if (!selectedValue) return '';
    
    const data = academicData as AcademicData;
    
    switch (label) {
      case 'Professor':
        const professor = data.professores.find(p => p.nome === selectedValue);
        return professor ? `${professor.departamento} - ${professor.especialidade}` : '';
        
      case 'Sala':
        const sala = data.salas.find(s => s.codigo === selectedValue);
        return sala ? `${sala.tipo} - ${sala.bloco}${sala.andar}º andar` : '';
        
      case 'Turma':
        const turma = data.turmas.find(t => t.codigo === selectedValue);
        return turma ? `${turma.curso}` : '';
        
      case 'Modalidade':
        const modalidade = data.tipos.find(t => t.nome === selectedValue && t.categoria === 'Modalidade');
        return modalidade ? 'Modalidade de Ensino' : '';
        
      case 'Disciplina':
        const disciplina = data.disciplinas.find(d => d.nome === selectedValue);
        return disciplina ? `${disciplina.codigo} - ${disciplina.tipo}` : '';
        
      case 'Código Disciplina':
        const disciplinaPorCodigo = data.disciplinas.find(d => d.codigo === selectedValue);
        return disciplinaPorCodigo ? `${disciplinaPorCodigo.nome} - ${disciplinaPorCodigo.tipo}` : '';
        
      case 'Semestre':
        const semestre = data.semestres.find(s => s.codigo === selectedValue);
        return semestre ? semestre.nome : '';
        
      case 'Horário Início':
      case 'Horário Final':
        const horario = data.horarios.find(h => h.hora === selectedValue);
        return horario ? horario.periodo : '';
        
      case 'Dia':
        const dia = data.dias.find(d => d.nome === selectedValue);
        return dia ? dia.nomeCompleto : '';
        
      default:
        return '';
    }
  };

  const additionalInfo = getAdditionalInfo();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0">
          {selectedValue ? (
            <div className="flex flex-col">
              <span className="text-sm text-gray-900 truncate">{selectedValue}</span>
              {additionalInfo && (
                <span className="text-xs text-gray-500 truncate">{additionalInfo}</span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500">{label}</span>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {selectedValue && (
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={14} className="text-gray-400" />
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-w-sm">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={`Buscar ${label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                return (
                  <div
                    key={option.id}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSelect(option)}
                  >
                    <div className="font-medium">{option.display}</div>
                    {option.additionalInfo && (
                      <div className="text-xs text-gray-500 mt-0.5">{option.additionalInfo}</div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Nenhum resultado encontrado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableFilter;