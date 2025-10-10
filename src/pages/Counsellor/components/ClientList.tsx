import React from 'react';
import { Users } from 'lucide-react';
import ClientTable, { Client } from './ClientTable';

interface ClientListProps {
  clients: Client[];
  searchQuery: string;
  onViewDetails: (clientId: number) => void;
  onClearSearch: () => void;
}

const ClientList: React.FC<ClientListProps> = ({ 
  clients, 
  searchQuery, 
  onViewDetails, 
  onClearSearch 
}) => {
  if (clients.length > 0) {
    return (
      <ClientTable
        clients={clients}
        onViewDetails={onViewDetails}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
      <p className="text-gray-600 mb-4">
        {searchQuery 
          ? `No clients match your search "${searchQuery}"`
          : "No clients match your current filters"
        }
      </p>
      {searchQuery && (
        <button 
          className="text-indigo-600 hover:text-indigo-800 font-medium"
          onClick={onClearSearch}
        >
          Clear search
        </button>
      )}
    </div>
  );
};

export default ClientList;
