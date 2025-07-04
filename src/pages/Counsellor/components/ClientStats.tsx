import React from 'react';
import { Users } from 'lucide-react';
import { Client } from './ClientCard';

interface ClientStatsProps {
  filteredClients: Client[];
}

const ClientStats: React.FC<ClientStatsProps> = ({ filteredClients }) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
      <div className="flex items-center gap-2 text-gray-600">
        <Users className="w-5 h-5" />
        <span className="text-sm">{filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} found</span>
        <span className="text-xs text-gray-500 hidden lg:inline">
          (<span className="text-indigo-500">{filteredClients.filter(c => c.anonymous).length}</span> anonymous, <span className="text-indigo-500">{filteredClients.filter(c => !c.anonymous).length}</span> identified, <span className="text-indigo-500">{filteredClients.filter(c => c.student).length}</span> students)
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort by:</span>
        <select className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary focus:border-opacity-50">
          <option value="name">Name (A-Z)</option>
          <option value="recent">Recent Activity</option>
          <option value="sessions">Session Count</option>
        </select>
      </div>
    </div>
  );
};

export default ClientStats;
