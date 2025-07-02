import { useState, useRef, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  required?: boolean;
}

const MultiSelectDropdown = ({ options, selected, onChange, label, required }: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const checkScrollPosition = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
    }
  };

  useEffect(() => {
    if (isOpen && listRef.current) {
      checkScrollPosition();
    }
  }, [isOpen, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mb-2 p-2" ref={dropdownRef}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-text">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-border rounded-3xl shadow-sm bg-white text-text
            hover:border-primary focus:border-primary focus:ring-0
            focus:outline-none transition duration-150 ease-in-out flex justify-between items-center"
        >
          <div className="flex flex-wrap gap-2 flex-grow">
            {selected.map(value => {
              const option = options.find(opt => opt.value === value);
              return (
                <div key={value} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                  {option?.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(value);
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
            {selected.length === 0 && <span className="text-gray-400">Select languages...</span>}
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? 'rotate-90' : 'rotate-0'
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-3xl shadow-lg max-h-60 overflow-hidden animate-fade-in">
            {/* Top scroll indicator */}
            {canScrollUp && (
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10 rounded-t-3xl"></div>
            )}
            
            <ul 
              ref={listRef}
              className="max-h-60 overflow-y-auto scrollbar-hide"
              onScroll={checkScrollPosition}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {options.map(option => (
                <li
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={`block px-4 py-2 w-full cursor-pointer transition-all duration-200 text-text flex items-center justify-between group ${
                    selected.includes(option.value) 
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-800 text-gray-800 font-medium' 
                      : 'hover:bg-primaryLight hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Modern checkbox indicator */}
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                      selected.includes(option.value)
                        ? 'bg-gray-800 border-gray-500 shadow-md scale-110'
                        : 'border-gray-300 group-hover:border-gray-400 group-hover:bg-gray-50'
                    }`}>
                      {selected.includes(option.value) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`transition-all duration-200 ${selected.includes(option.value) ? 'font-semibold' : ''}`}>
                      {option.label}
                    </span>
                  </div>
                  
                  {/* Modern selection badge */}
                  {selected.includes(option.value) && (
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                      Selected
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Bottom scroll indicator */}
            {canScrollDown && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10 rounded-b-3xl"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
