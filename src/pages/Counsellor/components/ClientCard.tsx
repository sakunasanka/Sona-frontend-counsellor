import React from 'react';
import { Calendar, MessageCircle, Phone, Clock } from 'lucide-react';
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

interface ClientCardProps {
  client: Client;
  onViewDetails: (clientId: number) => void;
}
const ClientCard: React.FC<ClientCardProps> = ({ client, onViewDetails }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[rgb(174,175,247)] hover:border-opacity-50 transition-all hover:shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Mobile-First Responsive Layout */}
        <div className="flex flex-col space-y-4 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start lg:space-y-0">
          {/* Mobile: All content stacked vertically, Desktop: Column 1 */}
          <div className="lg:col-span-4 flex items-start space-x-4">
            <div className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ${client.anonymous ? 'bg-[rgb(174,175,247)] bg-opacity-10 flex items-center justify-center' : 'border-2 border-gray-100'}`}>
              {client.anonymous ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[rgb(174,175,247)]">
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
            <div className="flex-1">
              {/* Name and badges */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-900">
                  {client.anonymous ? (client.nickname || 'Anonymous Client') : client.name}
                </h3>
                {client.anonymous && (
                  <span className="px-2 py-0.5 rounded-full bg-[rgb(174,175,247)] bg-opacity-25 text-indigo-800 text-xs font-medium">
                    Anonymous
                  </span>
                )}
                {client.student && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-[rgb(174,175,247)] bg-opacity-25 text-indigo-500 text-xs rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 717.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                    Student
                  </span>
                )}
              </div>
              
              {/* Age and Gender */}
              {!client.anonymous && (
                <div className="text-sm text-gray-600 mb-1">
                  {client.age} years old • {client.gender}
                </div>
              )}
              
              {/* College/Institution */}
              {client.institution && (
                <div className="text-sm text-indigo-600 font-medium mb-3">
                  {client.institution}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <Button 
                    variant="calendar" 
                    onClick={() => navigate(`/counsellor/chats?clientId=${client.id}`)} 
                    icon={<MessageCircle className="w-4 h-4" />}
                >
                    <span className="hidden sm:inline">Message</span>
                </Button>
                <button 
                  className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium rounded-lg border border-gray-300 transition-colors flex items-center justify-center touch-manipulation"
                  onClick={() => onViewDetails(client.id)}
                >
                  Details
                </button>
              </div>
            </div>
          </div>

          {/* Mobile: Contact Section, Desktop: Column 2 */}
          <div className="lg:col-span-4 lg:text-left">
            <div className="flex items-center justify-between sm:block">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Contact</h4>
              <div className="sm:hidden">
                {/* Mobile Status Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.status === 'active' ? 'bg-green-100 text-green-800' : 
                  client.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {client.status === 'active' ? 'Active' : 
                   client.status === 'new' ? 'New' : 
                   'Inactive'}
                </span>
              </div>
            </div>
            {!client.anonymous ? (
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{client.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="truncate">{client.email}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-3 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span>Contact details hidden</span>
              </div>
            )}
          </div>

          {/* Mobile: Concerns Section, Desktop: Column 3 */}
          <div className="lg:col-span-2 lg:text-left">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Concerns</h4>
            {client.concerns.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {client.concerns.slice(0, 4).map((concern, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                  >
                    {concern}
                  </span>
                ))}
                {client.concerns.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                    +{client.concerns.length - 4} more
                  </span>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No concerns listed</div>
            )}
          </div>

          {/* Mobile: Session Stats (at bottom), Desktop: Column 4 (right-aligned) */}
          <div className="lg:col-span-2 lg:text-right">
            {/* Desktop Status Badge (hidden on mobile) */}
            <div className="hidden lg:flex justify-end mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                client.status === 'active' ? 'bg-green-100 text-green-800' : 
                client.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {client.status === 'active' ? 'Active' : 
                 client.status === 'new' ? 'New' : 
                 'Inactive'}
              </span>
            </div>
            
            {/* Session Stats */}
            <div className="grid grid-cols-2 gap-4 lg:block lg:space-y-1 lg:text-sm text-gray-600">
              <div className="flex items-center lg:justify-end bg-gray-50 lg:bg-transparent p-2 lg:p-0 rounded-lg lg:rounded-none">
                <Calendar className="w-4 h-4 mr-2 lg:mr-1 text-gray-500" />
                <span className="text-sm lg:text-sm"><span className="font-medium text-indigo-600">{client.sessionCount}</span> sessions</span>
              </div>
              <div className="flex items-center lg:justify-end bg-gray-50 lg:bg-transparent p-2 lg:p-0 rounded-lg lg:rounded-none">
                <Clock className="w-4 h-4 mr-2 lg:mr-1 text-gray-500" />
                <span className="text-sm lg:text-sm font-medium text-indigo-600">{client.lastSession}</span>
              </div>
              {client.nextSession && (
                <div className="flex items-center lg:justify-end text-indigo-600 bg-indigo-50 lg:bg-transparent p-2 lg:p-0 rounded-lg lg:rounded-none col-span-2 lg:col-span-1">
                  <Calendar className="w-4 h-4 mr-2 lg:mr-1" />
                  <span className="font-medium text-xs lg:text-xs">Next: {client.nextSession}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
