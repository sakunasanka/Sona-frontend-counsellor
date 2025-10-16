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
import { getClients, type Client as APIClient } from '../../api/counsellorAPI';

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
    navigate(`/clients/${clientId}`);
  };

  // State for clients data and loading
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform API client data to component format
  const transformApiClient = (apiClient: APIClient): Client => {
    return {
      id: apiClient.id,
      name: apiClient.name,
      profileImage: apiClient.avatar || 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png', // Default image
      age: 25, // Default age as API doesn't provide this
      gender: 'Unknown', // Default gender as API doesn't provide this
      email: 'N/A', // API doesn't provide email
      phone: 'N/A', // API doesn't provide phone
      sessionCount: apiClient.total_sessions,
      lastSession: apiClient.last_session ? new Date(apiClient.last_session + (apiClient.last_session.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        timeZone: 'Asia/Colombo' 
      }) : 'No sessions',
      nextSession: apiClient.next_appointment ? new Date(apiClient.next_appointment + (apiClient.next_appointment.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', { timeZone: 'Asia/Colombo' }) : undefined,
      concerns: apiClient.concerns || [], // Get concerns from API response
      status: apiClient.status,
      notes: '', // API doesn't provide notes
      anonymous: apiClient.is_anonymous,
      nickname: apiClient.is_anonymous ? `Student ${apiClient.student_id}` : undefined,
      student: true, // Assuming all clients are students based on student_id field
      institution: 'University', // Default institution
    };
  };

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getClients({
        page: 1,
        limit: 100, // Get all clients for now
      });

      if (response.success && response.data) {
        const transformedClients = response.data.clients.map(transformApiClient);
        setClients(transformedClients);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

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

      {/* Bottom section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div>
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <NavBar onMenuClick={toggleSidebar} />
          <div className="p-4 lg:p-6">
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
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading clients...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error loading clients</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button 
                    onClick={fetchClients}
                    className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Client Count and Cards - Only show when not loading */}
          {!loading && !error && (
            <>
              <ClientStats filteredClients={filteredClients} />
              <ClientList 
                clients={filteredClients}
                searchQuery={searchQuery}
                onViewDetails={handleViewClientDetails}
                onClearSearch={() => setSearchQuery('')}
              />
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorClients;
