import { useState, useEffect, useRef } from 'react';
import { FilterType, AnonymousFilterType, StudentFilterType } from '../components';

export const useClientFilters = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [anonymousFilter, setAnonymousFilter] = useState<AnonymousFilterType>('all');
  const [studentFilter, setStudentFilter] = useState<StudentFilterType>('all');
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const openFilterDrawer = () => {
    setShowFilter(true);
    setFilterOpen(true);
    setIsClosing(false);
  };
  
  const closeFilterDrawer = () => {
    setIsClosing(true);
    setFilterOpen(false);
    setTimeout(() => {
      setShowFilter(false);
      setIsClosing(false);
    }, 300); // Match animation duration
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
      // For desktop dropdown
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        if (filterOpen && window.innerWidth >= 1024) { // Only close desktop on large screens
          closeFilterDrawer();
        }
      }
      
      // For mobile modal - close if clicking on the backdrop
      if (filterOpen && window.innerWidth < 1024) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('bg-black') || target.classList.contains('bg-opacity-50')) {
          closeFilterDrawer();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen]);

  return {
    // State
    filterOpen,
    showFilter,
    isClosing,
    activeFilter,
    anonymousFilter,
    studentFilter,
    filterDropdownRef,
    
    // Handlers
    openFilterDrawer,
    closeFilterDrawer,
    handleDesktopFilterToggle,
    handleMobileFilterToggle,
    setActiveFilter,
    setAnonymousFilter,
    setStudentFilter,
  };
};
