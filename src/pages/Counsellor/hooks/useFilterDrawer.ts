import { useState, useRef, useCallback, useEffect } from 'react';

export const useFilterDrawer = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isClosingRef = useRef(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const openTimeoutRef = useRef<number | null>(null);

  const openFilterDrawer = useCallback(() => {
    if (filterOpen || isClosingRef.current) return;
    
    // Clear any existing timeouts
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    setShowFilter(true);
    
    // Small delay to ensure proper state update before opening
    openTimeoutRef.current = window.setTimeout(() => {
      setFilterOpen(true);
      setIsClosing(false);
      openTimeoutRef.current = null;
    }, 10);
  }, [filterOpen]);

  const closeFilterDrawer = useCallback(() => {
    if (isClosingRef.current || !filterOpen) return;
    
    // Clear any existing timeouts
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    
    isClosingRef.current = true;
    setIsClosing(true);
    setFilterOpen(false);
    
    closeTimeoutRef.current = window.setTimeout(() => {
      if (isClosingRef.current) {
        setShowFilter(false);
        setIsClosing(false);
        isClosingRef.current = false;
        closeTimeoutRef.current = null;
      }
    }, 350);
  }, [filterOpen]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
    };
  }, []);

  return {
    filterOpen,
    showFilter,
    isClosing,
    isClosingRef,
    openFilterDrawer,
    closeFilterDrawer,
  };
};
