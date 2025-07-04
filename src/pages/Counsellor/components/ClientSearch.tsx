import React from 'react';
import { Search } from 'lucide-react';

interface ClientSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="p-4">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search clients by name, email, phone..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary focus:border-opacity-50 transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        {searchQuery && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => onSearchChange('')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientSearch;
