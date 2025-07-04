import React from 'react';
import { AnonymousFilterType, StudentFilterType } from './ClientFilters';

interface FilterDrawerProps {
  // State
  showFilter: boolean;
  isClosing: boolean;
  anonymousFilter: AnonymousFilterType;
  studentFilter: StudentFilterType;
  
  // Handlers
  onClose: () => void;
  onAnonymousFilterChange: (filter: AnonymousFilterType) => void;
  onStudentFilterChange: (filter: StudentFilterType) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  showFilter,
  isClosing,
  anonymousFilter,
  studentFilter,
  onClose,
  onAnonymousFilterChange,
  onStudentFilterChange,
}) => {
  if (!showFilter) {
    return null;
  }

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Add a data attribute to the document to signal that a close button was clicked
    document.documentElement.setAttribute('data-filter-closing', 'true');
    
    setTimeout(() => {
      document.documentElement.removeAttribute('data-filter-closing');
    }, 200);
    
    onClose();
  };

  return (
    <>
      {/* Mobile: Filter modal overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        onClick={(e) => {
          // Only close if clicking directly on the backdrop (not on child elements)
          if (e.target === e.currentTarget) {
            handleClose(e);
          }
        }}
        onMouseDown={(e) => {
          // Prevent event from bubbling up to document handlers
          if (e.target === e.currentTarget) {
            e.stopPropagation();
          }
        }}
      >
        <div 
          className={`bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ease-out ${isClosing ? 'animate-slideDown' : 'animate-slideUp'}`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Privacy Status
              </label>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="mobile-anonymous-all" 
                    name="mobileAnonymousFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200"
                    style={{accentColor: 'rgb(174,175,247)'}} 
                    checked={anonymousFilter === 'all'}
                    onChange={() => onAnonymousFilterChange('all')}
                  />
                  <label htmlFor="mobile-anonymous-all" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    All Clients
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="mobile-anonymous-only" 
                    name="mobileAnonymousFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={anonymousFilter === 'anonymous'}
                    onChange={() => onAnonymousFilterChange('anonymous')}
                  />
                  <label htmlFor="mobile-anonymous-only" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    Anonymous Only
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="mobile-identified-only" 
                    name="mobileAnonymousFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={anonymousFilter === 'identified'}
                    onChange={() => onAnonymousFilterChange('identified')}
                  />
                  <label htmlFor="mobile-identified-only" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    Identified Only
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Client Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="mobile-student-all" 
                    name="mobileStudentFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={studentFilter === 'all'}
                    onChange={() => onStudentFilterChange('all')}
                  />
                  <label htmlFor="mobile-student-all" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    All Clients
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="mobile-student-only" 
                    name="mobileStudentFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={studentFilter === 'student'}
                    onChange={() => onStudentFilterChange('student')}
                  />
                  <label htmlFor="mobile-student-only" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    Students Only
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="mobile-non-student-only" 
                    name="mobileStudentFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={studentFilter === 'non-student'}
                    onChange={() => onStudentFilterChange('non-student')}
                  />
                  <label htmlFor="mobile-non-student-only" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    Non-Students Only
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button 
                onClick={handleClose}
                className="w-full px-4 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primaryLight transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop: Dropdown overlay positioned relative to the filter button */}
      <div 
        className={`hidden lg:block absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`} 
        style={{position: 'absolute'}}
        data-filter-dropdown
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Privacy Status
              </label>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="desktop-anonymous-all" 
                    name="desktopAnonymousFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50"
                    style={{accentColor: 'rgb(174,175,247)'}} 
                    checked={anonymousFilter === 'all'}
                    onChange={() => onAnonymousFilterChange('all')}
                  />
                  <label htmlFor="desktop-anonymous-all" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    All Clients
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="desktop-anonymous-only" 
                    name="desktopAnonymousFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={anonymousFilter === 'anonymous'}
                    onChange={() => onAnonymousFilterChange('anonymous')}
                  />
                  <label htmlFor="desktop-anonymous-only" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    Anonymous Only
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="desktop-identified-only" 
                    name="desktopAnonymousFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={anonymousFilter === 'identified'}
                    onChange={() => onAnonymousFilterChange('identified')}
                  />
                  <label htmlFor="desktop-identified-only" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    Identified Only
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Client Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="desktop-student-all" 
                    name="desktopStudentFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={studentFilter === 'all'}
                    onChange={() => onStudentFilterChange('all')}
                  />
                  <label htmlFor="desktop-student-all" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    All Clients
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="desktop-student-only" 
                    name="desktopStudentFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={studentFilter === 'student'}
                    onChange={() => onStudentFilterChange('student')}
                  />
                  <label htmlFor="desktop-student-only" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    Students Only
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="desktop-non-student-only" 
                    name="desktopStudentFilter" 
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50"
                    style={{accentColor: 'rgb(174,175,247)'}}
                    checked={studentFilter === 'non-student'}
                    onChange={() => onStudentFilterChange('non-student')}
                  />
                  <label htmlFor="desktop-non-student-only" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    Non-Students Only
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Count
                </label>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary">
                  <option value="any">Any</option>
                  <option value="new">New (1-2 sessions)</option>
                  <option value="regular">Regular (3-10 sessions)</option>
                  <option value="long-term">Long-term (10+ sessions)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Concern
                </label>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary">
                  <option value="any">Any</option>
                  <option value="anxiety">Anxiety</option>
                  <option value="depression">Depression</option>
                  <option value="stress">Stress</option>
                  <option value="relationships">Relationships</option>
                  <option value="academic">Academic</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Session
              </label>
              <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary">
                <option value="any">Any time</option>
                <option value="week">Within last week</option>
                <option value="month">Within last month</option>
                <option value="three-months">Within last 3 months</option>
              </select>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button 
                onClick={handleClose}
                className="w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primaryLight transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
