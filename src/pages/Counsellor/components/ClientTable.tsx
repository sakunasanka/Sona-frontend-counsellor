import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Eye, ArrowUpDown } from 'lucide-react';
import { Button } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';

export interface Client {
  id: number;
  name: string;
  profileImage: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  sessionCount: number;
  lastSession: string;
  nextSession?: string;
  concerns: string[];
  status: 'active' | 'inactive' | 'new';
  notes?: string;
  anonymous: boolean;
  nickname?: string;
  student?: boolean;
  institution?: string;
}

type SortField = 'name' | 'sessionCount' | 'lastSession' | 'concerns';
type SortDirection = 'asc' | 'desc';

interface ClientTableProps {
  clients: Client[];
  onViewDetails: (clientId: number) => void;
}

const ITEMS_PER_PAGE = 10;

const ClientTable: React.FC<ClientTableProps> = ({ clients, onViewDetails }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.anonymous ? (a.nickname || 'Anonymous') : a.name;
        bValue = b.anonymous ? (b.nickname || 'Anonymous') : b.name;
        break;
      case 'sessionCount':
        aValue = a.sessionCount;
        bValue = b.sessionCount;
        break;
      case 'lastSession':
        // Parse date string and convert to timestamp in Asia/Colombo timezone
        const parseDateForSorting = (dateStr: string) => {
          if (dateStr === 'No sessions') return new Date('1970-01-01').getTime();
          // Create date object and ensure it's treated as Asia/Colombo time
          const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
          return date.getTime();
        };
        aValue = parseDateForSorting(a.lastSession);
        bValue = parseDateForSorting(b.lastSession);
        break;
      case 'concerns':
        aValue = a.concerns.length;
        bValue = b.concerns.length;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-indigo-600 transition-colors font-medium text-gray-700 group"
    >
      {children}
      <ArrowUpDown className={`w-4 h-4 transition-transform ${sortField === field ? 'text-indigo-600' : 'text-gray-400'}`} />
    </button>
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedClients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedClients = sortedClients.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <SortButton field="name">Client</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="concerns">Concerns</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="sessionCount">Sessions</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="lastSession">Last Session</SortButton>
              </th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${client.anonymous ? 'bg-indigo-100 flex items-center justify-center' : 'border-2 border-gray-200'}`}>
                      {client.anonymous ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <img
                          src={client.profileImage}
                          alt={client.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">
                          {client.anonymous ? (client.nickname || 'Anonymous Client') : client.name}
                        </div>
                        {client.student && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Student
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {client.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {client.concerns.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {client.concerns.slice(0, 2).map((concern, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium"
                        >
                          {concern}
                        </span>
                      ))}
                      {client.concerns.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{client.concerns.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">None</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-indigo-600">{client.sessionCount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{client.lastSession}</span>
                  {client.nextSession && (
                    <div className="text-xs text-indigo-600 mt-1">
                      Next: {client.nextSession}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="calendar"
                      onClick={() => navigate(`/counsellor/chats?clientId=${client.id}`)}
                      icon={<MessageCircle className="w-4 h-4" />}
                      className="px-3 py-2 text-sm flex-1 min-w-0"
                    >
                      <span className="hidden sm:inline">Message</span>
                    </Button>
                    <button
                      onClick={() => onViewDetails(client.id)}
                      className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex-1 justify-center min-w-0"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedClients.length)} of {sortedClients.length} clients
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {sortedClients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ClientTable;