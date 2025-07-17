import React, { useState, useEffect, useRef } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { useNavigate } from 'react-router-dom';
import {
  ClientSearch,
  ClientFilters,
  FilterDrawer,
  ClientStats,
  ClientList,
  type Client,
  type FilterType,
  type AnonymousFilterType,
  type StudentFilterType,
} from './components';
import { filterClients } from './utils';
import { mockClients } from './data';

// Add CSS animations for the drawer
const drawerStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  
  .animate-fadeOut {
    animation: fadeOut 0.2s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .animate-slideDown {
    animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

// Inject styles into the head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = drawerStyles;
  document.head.appendChild(styleSheet);
}

const CounsellorClients: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [anonymousFilter, setAnonymousFilter] = useState<AnonymousFilterType>('all');
  const [studentFilter, setStudentFilter] = useState<StudentFilterType>('all');
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const preventClickOutsideRef = useRef(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  // Filter handlers
  const openFilterDrawer = () => {
    if (filterOpen || isClosingRef.current) return; // Prevent opening when already open or closing
    
    setShowFilter(true);
    setFilterOpen(true);
    setIsClosing(false);
  };
  
  const closeFilterDrawer = () => {
    if (isClosingRef.current || !filterOpen) return; // Prevent multiple close calls and closing when not open
    
    // Set flag to prevent click-outside detection
    preventClickOutsideRef.current = true;
    
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    isClosingRef.current = true;
    setIsClosing(true);
    setFilterOpen(false);
    
    // Use a longer timeout to ensure animation completes
    closeTimeoutRef.current = window.setTimeout(() => {
      if (isClosingRef.current) { // Double-check before setting state
        setShowFilter(false);
        setIsClosing(false);
        isClosingRef.current = false;
        closeTimeoutRef.current = null;
        preventClickOutsideRef.current = false; // Reset flag
      }
    }, 350); // Slightly longer than animation duration
  };
  
  const handleDesktopFilterToggle = () => {
    if (filterOpen) {
      closeFilterDrawer();
    } else {
      openFilterDrawer();
    }
  };

  const handleMobileFilterToggle = () => {
    if (filterOpen) {
      closeFilterDrawer();
    } else {
      openFilterDrawer();
    }
  };
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't process if already closing, not open, prevention flag is set, or close button was clicked
      if (
        isClosingRef.current || 
        !filterOpen || 
        preventClickOutsideRef.current ||
        document.documentElement.hasAttribute('data-filter-closing')
      ) return;
      
      const target = event.target as HTMLElement;
      
      // For desktop dropdown - only close if clicking outside the entire filter area
      if (window.innerWidth >= 1024) {
        // Check if click is on filter button or its children
        const isFilterButton = target.closest('[data-filter-button]');
        
        // Check if click is within the filter dropdown or its children
        const isFilterDropdown = target.closest('[data-filter-dropdown]');
        
        // Check if click is within the filter container area
        const isFilterContainer = filterDropdownRef.current?.contains(target);
        
        // Only close if clicking completely outside all filter-related elements
        if (!isFilterButton && !isFilterDropdown && !isFilterContainer) {
          closeFilterDrawer();
        }
      }
    };

    if (filterOpen) {
      // Only add listener for desktop
      if (window.innerWidth >= 1024) {
        // Small delay to prevent immediate closure when opening
        const timeoutId = setTimeout(() => {
          document.addEventListener('mousedown', handleClickOutside, { passive: false });
        }, 150);
        
        return () => {
          clearTimeout(timeoutId);
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }
  }, [filterOpen]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  const handleViewClientDetails = (clientId: number) => {
    navigate(`/counsellor-clients/${clientId}`);
  };

  // Mock client data
  const [clients] = useState<Client[]>(mockClients);

  // Filter clients based on search query, active filter, anonymous status, and student status
  const filteredClients = filterClients(
    clients,
    searchQuery,
    activeFilter,
    anonymousFilter,
    studentFilter
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      {/* <NavBar onMenuClick={toggleSidebar} /> */}

      {/* Bottom section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r hidden lg:block">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Your Clients</h1>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 relative overflow-visible">
            <ClientSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            <ClientFilters
              activeFilter={activeFilter}
              anonymousFilter={anonymousFilter}
              studentFilter={studentFilter}
              filterOpen={filterOpen}
              onActiveFilterChange={setActiveFilter}
              onAnonymousFilterChange={setAnonymousFilter}
              onStudentFilterChange={setStudentFilter}
              onFilterToggle={handleDesktopFilterToggle}
              onMobileFilterToggle={handleMobileFilterToggle}
              filterDropdownRef={filterDropdownRef}
            />
            
            {/* Expanded filter options */}
            <FilterDrawer
              showFilter={showFilter}
              isClosing={isClosing}
              anonymousFilter={anonymousFilter}
              studentFilter={studentFilter}
              onClose={closeFilterDrawer}
              onAnonymousFilterChange={setAnonymousFilter}
              onStudentFilterChange={setStudentFilter}
            />
          </div>

          {/* Client Count */}
          <ClientStats filteredClients={filteredClients} />

          {/* Client Cards */}
          <ClientList 
            clients={filteredClients}
            searchQuery={searchQuery}
            onViewDetails={handleViewClientDetails}
            onClearSearch={() => setSearchQuery('')}
          />
        </div>
      </div>
    </div>
  );
};

export default CounsellorClients;
