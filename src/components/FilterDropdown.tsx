
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, className }) => {
  return (
    <Button variant="outline" className={`flex items-center justify-between bg-white ${className}`}>
      <span>{label}</span>
      <ChevronDown size={16} />
    </Button>
  );
};

export default FilterDropdown;
