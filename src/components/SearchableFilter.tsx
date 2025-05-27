import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface SearchableFilterProps {
  label: string;
  options?: string[];
  onSelect: (value: string) => void;
  className?: string;
  value?: string; // Add value prop for controlled component
}

const SearchableFilter: React.FC<SearchableFilterProps> = ({ 
  label, 
  options = [], 
  onSelect, 
  className = "",
  value = "" // Default value
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update selectedValue when value prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Generate time options from 7:30 to 22:30
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 7; hour <= 22; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return times;
};

  // Sample data - replace with your actual data
  const sampleOptions = {
    Professor: ['Dr. Silva', 'Prof. Santos', 'Dr. Oliveira', 'Prof. Costa', 'Dr. Ferreira'],
    Semestre: ['2024.1', '2024.2', '2023.1', '2023.2'],
    'Horário Início': generateTimeOptions(),
    'Horário Final': generateTimeOptions(),
    Sala: ['A101', 'A102', 'B201', 'B202', 'C301', 'Lab01', 'Lab02'],
    Dia: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    Turma: ['Turma A', 'Turma B', 'Turma C', 'Turma D'],
    Disciplina: ['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Português', 'Inglês']
  };

  const currentOptions = options.length > 0 ? options : (sampleOptions[label as keyof typeof sampleOptions] || []);
  
  // Filter options based on search term
  const filteredOptions = currentOptions.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setSearchTerm('');
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue('');
    setSearchTerm('');
    if (onSelect) {
      onSelect('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          {selectedValue ? (
            <span className="text-sm text-gray-900">{selectedValue}</span>
          ) : (
            <span className="text-sm text-gray-500">{label}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
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
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))
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