import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

export type FilterType = 'all' | 'active' | 'new' | 'inactive';
export type AnonymousFilterType = 'all' | 'anonymous' | 'identified';
export type StudentFilterType = 'all' | 'student' | 'non-student';

interface ClientFiltersProps {
  // State
  activeFilter: FilterType;
  anonymousFilter: AnonymousFilterType;
  studentFilter: StudentFilterType;
  filterOpen: boolean;
  
  // Handlers
  onActiveFilterChange: (filter: FilterType) => void;
  onAnonymousFilterChange: (filter: AnonymousFilterType) => void;
  onStudentFilterChange: (filter: StudentFilterType) => void;
  onFilterToggle: () => void;
  onMobileFilterToggle: () => void;
  
  // Ref for click outside
  filterDropdownRef: React.RefObject<HTMLDivElement | null>;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({
  activeFilter,
  anonymousFilter,
  studentFilter,
  filterOpen,
  onActiveFilterChange,
  onAnonymousFilterChange,
  onStudentFilterChange,
  onFilterToggle,
  onMobileFilterToggle,
  filterDropdownRef,
}) => {
  return (
    <>
      {/* Mobile: Simplified filter bar */}
      <div className="border-t border-gray-100 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Status:</span>
            <select 
              value={activeFilter} 
              onChange={(e) => onActiveFilterChange(e.target.value as FilterType)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="new">New</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button 
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onMobileFilterToggle();
            }}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
              {(anonymousFilter !== 'all' ? 1 : 0) + (studentFilter !== 'all' ? 1 : 0)}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop: Full filter bar */}
      {/* <div className="border-t border-gray-100 px-4 py-2 hidden lg:flex flex-wrap gap-2 items-center relative overflow-visible">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm text-gray-700 mr-1">Status:</span>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              activeFilter === 'all' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onActiveFilterChange('all')}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              activeFilter === 'active' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onActiveFilterChange('active')}
          >
            Active
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              activeFilter === 'new' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onActiveFilterChange('new')}
          >
            New
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              activeFilter === 'inactive' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onActiveFilterChange('inactive')}
          >
            Inactive
          </button>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-1"></div>
        
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm text-gray-700 mr-1">Privacy:</span>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              anonymousFilter === 'all' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onAnonymousFilterChange('all')}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              anonymousFilter === 'anonymous' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onAnonymousFilterChange('anonymous')}
          >
            Anonymous
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              anonymousFilter === 'identified' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onAnonymousFilterChange('identified')}
          >
            Identified
          </button>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-1"></div>
        
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm text-gray-700 mr-1">Type:</span>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              studentFilter === 'all' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onStudentFilterChange('all')}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              studentFilter === 'student' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onStudentFilterChange('student')}
          >
            Students
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              studentFilter === 'non-student' ? 'bg-primary bg-opacity-50 text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onStudentFilterChange('non-student')}
          >
            Non-Students
          </button>
        </div>
        
        <div className="ml-auto relative" ref={filterDropdownRef}>
          <button 
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onFilterToggle();
            }}
            data-filter-button
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterOpen ? 'Hide Filters' : 'More Filters'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div> */}
    </>
  );
};

export default ClientFilters;
