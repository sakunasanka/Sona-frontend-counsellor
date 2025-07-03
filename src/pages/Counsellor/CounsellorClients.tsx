import React, { useState } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { Search, Users, Calendar, MessageCircle, Filter, ChevronDown, Phone, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Client {
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
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[rgb(174,175,247)] hover:border-opacity-50 transition-all hover:shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left Section - Client info */}
        <div className="flex p-4 flex-1">
          <div className={`w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ${client.anonymous ? 'bg-[rgb(174,175,247)] bg-opacity-10 flex items-center justify-center' : 'border-2 border-gray-100'}`}>
            {client.anonymous ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[rgb(174,175,247)]">
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
          
          <div className="ml-4 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {client.anonymous ? (client.nickname || 'Anonymous Client') : client.name}
                  </h3>
                  {client.anonymous && (
                    <span className="px-2 py-0.5 rounded-full bg-[rgb(174,175,247)] bg-opacity-25 text-indigo-800 text-xs font-medium">
                      Anonymous
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {!client.anonymous && <span>{client.age} yrs • {client.gender}</span>}
                    {client.student && (
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 bg-[rgb(174,175,247)] bg-opacity-25 text-indigo-500 text-xs rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                          </svg>
                          Student
                        </span>
                        {client.institution && (
                          <span className="text-xs text-gray-500">• {client.institution}</span>
                        )}
                      </div>
                    )}
                  </div>
                
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium h-fit ${
                client.status === 'active' ? 'bg-[rgb(174,175,247)] bg-opacity-25 text-indigo-800' : 
                client.status === 'new' ? 'bg-[rgb(174,175,247)] bg-opacity-25 text-indigo-800' : 
                'bg-[rgb(174,175,247)] bg-opacity-25 text-indigo-800'
              }`}>
                {client.status === 'active' ? 'Active' : 
                 client.status === 'new' ? 'New Client' : 
                 'Inactive'}
              </span>
            </div>
            
            {/* Email and Phone */}
            {!client.anonymous ? (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1">
                <div className="flex items-center text-sm text-gray-600 truncate">
                  <Phone className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{client.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 truncate">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="truncate">{client.email}</span>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span>Contact details hidden for privacy</span>
                </div>
              </div>
            )}
            
            {/* Tags for concerns */}
            {client.concerns.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {client.concerns.map((concern, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {concern}
                    </span>
                  )).slice(0, 3)}
                  {client.concerns.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{client.concerns.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Section - Stats and actions */}
        <div className="border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50 md:w-64 lg:w-72 flex-shrink-0">
          <div className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>Sessions: <span className="font-medium text-indigo-500">{client.sessionCount}</span></span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span>Last session: <span className="font-medium text-indigo-500">{client.lastSession}</span></span>
              </div>
              {client.nextSession && (
                <div className="flex items-center text-sm text-indigo-500">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                  <span className="font-medium">{client.nextSession}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex flex-col space-y-2">
              <button className="w-full py-1.5 px-3 bg-primary hover:bg-primaryLight text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button 
                className="w-full py-1.5 px-3 bg-white hover:bg-gray-100 text-gray-800 text-sm font-medium rounded-md border border-gray-300 transition-colors"
                onClick={() => onViewDetails(client.id)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CounsellorClients: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'new' | 'inactive'>('all');
  const [anonymousFilter, setAnonymousFilter] = useState<'all' | 'anonymous' | 'identified'>('all');
  const [studentFilter, setStudentFilter] = useState<'all' | 'student' | 'non-student'>('all');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  const handleViewClientDetails = (clientId: number) => {
    navigate(`/counsellor-clients/${clientId}`);
  };

  // Mock client data
  const [clients] = useState<Client[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      profileImage: "/assets/images/student-photo.png",
      age: 22,
      gender: "Female",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      sessionCount: 8,
      lastSession: "2 days ago",
      nextSession: "July 10, 10:00 AM",
      concerns: ["Anxiety", "Stress", "Academic Pressure"],
      status: 'active',
      notes: "Making good progress with anxiety management techniques.",
      anonymous: false,
      student: true,
      institution: "Stanford University"
    },
    {
      id: 2,
      name: "James Wilson",
      profileImage: "/assets/images/student-photo.png",
      age: 25,
      gender: "Male",
      email: "james.wilson@example.com",
      phone: "+1 (555) 987-6543",
      sessionCount: 3,
      lastSession: "1 week ago",
      concerns: ["Depression", "Relationship Issues"],
      status: 'active',
      anonymous: false,
      student: false
    },
    {
      id: 3,
      name: "Emily Chen",
      profileImage: "/assets/images/student-photo.png",
      age: 19,
      gender: "Female",
      email: "emily.chen@example.com",
      phone: "+1 (555) 234-5678",
      sessionCount: 1,
      lastSession: "Yesterday",
      nextSession: "July 7, 2:00 PM",
      concerns: ["Social Anxiety", "Self-esteem"],
      status: 'new',
      anonymous: true,
      nickname: "Sunshine",
      student: true,
      institution: "Berkeley College"
    },
    {
      id: 4,
      name: "Michael Brown",
      profileImage: "/assets/images/student-photo.png",
      age: 28,
      gender: "Male",
      email: "michael.brown@example.com",
      phone: "+1 (555) 876-5432",
      sessionCount: 12,
      lastSession: "3 weeks ago",
      concerns: ["Career Planning", "Work-life Balance"],
      status: 'inactive',
      anonymous: false,
      student: false
    },
    {
      id: 5,
      name: "Olivia Martinez",
      profileImage: "/assets/images/student-photo.png",
      age: 21,
      gender: "Female",
      email: "olivia.martinez@example.com",
      phone: "+1 (555) 345-6789",
      sessionCount: 5,
      lastSession: "4 days ago",
      nextSession: "July 12, 3:30 PM",
      concerns: ["Family Issues", "Adjustment Disorder"],
      status: 'active',
      anonymous: true,
      nickname: "Lily",
      student: true,
      institution: "UCLA"
    },
    {
      id: 6,
      name: "David Lee",
      profileImage: "/assets/images/student-photo.png",
      age: 24,
      gender: "Male",
      email: "david.lee@example.com",
      phone: "+1 (555) 456-7890",
      sessionCount: 2,
      lastSession: "2 weeks ago",
      concerns: ["Exam Stress", "Sleep Problems"],
      status: 'new',
      anonymous: false,
      student: true,
      institution: "MIT"
    },
    {
      id: 7,
      name: "Sophia Patel",
      profileImage: "/assets/images/student-photo.png",
      age: 20,
      gender: "Female",
      email: "sophia.patel@example.com",
      phone: "+1 (555) 567-8901",
      sessionCount: 10,
      lastSession: "5 days ago",
      nextSession: "July 15, 9:00 AM",
      concerns: ["Identity Issues", "Cultural Adjustment"],
      status: 'active',
      anonymous: true,
      nickname: "Starlight",
      student: false
    },
    {
      id: 8,
      name: "Thomas Wang",
      profileImage: "/assets/images/student-photo.png",
      age: 23,
      gender: "Male",
      email: "thomas.wang@example.com",
      phone: "+1 (555) 678-9012",
      sessionCount: 6,
      lastSession: "1 month ago",
      concerns: ["Loneliness", "Homesickness"],
      status: 'inactive',
      anonymous: false,
      student: false
    },
    {
      id: 9,
      name: "Alex Morgan",
      profileImage: "/assets/images/student-photo.png",
      age: 32,
      gender: "Non-binary",
      email: "alex.morgan@example.com",
      phone: "+1 (555) 123-9876",
      sessionCount: 4,
      lastSession: "2 weeks ago",
      concerns: ["Work Stress", "Anxiety"],
      status: 'active',
      anonymous: true,
      nickname: "Phoenix",
      student: false
    }
  ]);

  // Filter clients based on search query, active filter, anonymous status, and student status
  const filteredClients = clients.filter(client => {
    // Filter by search query
    const matchesSearch = client.anonymous 
      ? (client.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         "anonymous client".includes(searchQuery.toLowerCase()) ||
         (client.institution && client.institution.toLowerCase().includes(searchQuery.toLowerCase())))
      : client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.institution && client.institution.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by status
    const matchesFilter = activeFilter === 'all' || client.status === activeFilter;
    
    // Filter by anonymous status
    const matchesAnonymousFilter = anonymousFilter === 'all' || 
      (anonymousFilter === 'anonymous' && client.anonymous) || 
      (anonymousFilter === 'identified' && !client.anonymous);
      
    // Filter by student status
    const matchesStudentFilter = studentFilter === 'all' || 
      (studentFilter === 'student' && client.student) || 
      (studentFilter === 'non-student' && !client.student);
    
    return matchesSearch && matchesFilter && matchesAnonymousFilter && matchesStudentFilter;
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <NavBar onMenuClick={toggleSidebar} />

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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Clients</h1>
              </div>

              {/* Search & Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="p-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search clients by name, email, phone..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(174,175,247)] focus:border-[rgb(174,175,247)] transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    {searchQuery && (
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchQuery('')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-100 px-4 py-2 flex flex-wrap gap-2 items-center">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm text-gray-700 mr-1">Status:</span>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        activeFilter === 'all' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        activeFilter === 'active' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveFilter('active')}
                    >
                      Active
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        activeFilter === 'new' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveFilter('new')}
                    >
                      New
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        activeFilter === 'inactive' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveFilter('inactive')}
                    >
                      Inactive
                    </button>
                  </div>
                  
                  <div className="h-4 border-r border-gray-300 mx-1"></div>
                  
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm text-gray-700 mr-1">Privacy:</span>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        anonymousFilter === 'all' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setAnonymousFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        anonymousFilter === 'anonymous' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setAnonymousFilter('anonymous')}
                    >
                      Anonymous
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        anonymousFilter === 'identified' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setAnonymousFilter('identified')}
                    >
                      Identified
                    </button>
                  </div>
                  
                  <div className="h-4 border-r border-gray-300 mx-1"></div>
                  
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm text-gray-700 mr-1">Type:</span>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        studentFilter === 'all' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setStudentFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        studentFilter === 'student' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setStudentFilter('student')}
                    >
                      Students
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        studentFilter === 'non-student' ? 'bg-[rgb(174,175,247)] bg-opacity-30 text-indigo-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setStudentFilter('non-student')}
                    >
                      Non-Students
                    </button>
                  </div>
                  
                  <div className="ml-auto">
                    <button 
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setFilterOpen(!filterOpen)}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>{filterOpen ? 'Hide Filters' : 'More Filters'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* Expanded filter options */}
                {filterOpen && (
                  <div className="border-t border-gray-100 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Privacy Status
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="anonymous-all" 
                            name="anonymousFilter" 
                            className="h-4 w-4 text-[rgb(174,175,247)] border-gray-300 focus:ring-[rgb(174,175,247)]"
                            checked={anonymousFilter === 'all'}
                            onChange={() => setAnonymousFilter('all')}
                          />
                          <label htmlFor="anonymous-all" className="ml-2 block text-sm text-gray-700">
                            All Clients
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="anonymous-only" 
                            name="anonymousFilter" 
                            className="h-4 w-4 text-[rgb(174,175,247)] border-gray-300 focus:ring-[rgb(174,175,247)]"
                            checked={anonymousFilter === 'anonymous'}
                            onChange={() => setAnonymousFilter('anonymous')}
                          />
                          <label htmlFor="anonymous-only" className="ml-2 block text-sm text-gray-700">
                            Anonymous Only
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="identified-only" 
                            name="anonymousFilter" 
                            className="h-4 w-4 text-green-600 border-gray-300 focus:ring-[rgb(174,175,247)]"
                            checked={anonymousFilter === 'identified'}
                            onChange={() => setAnonymousFilter('identified')}
                          />
                          <label htmlFor="identified-only" className="ml-2 block text-sm text-gray-700">
                            Identified Only
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Client Type
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="student-all" 
                            name="studentFilter" 
                            className="h-4 w-4 text-[rgb(174,175,247)] border-gray-300 focus:ring-[rgb(174,175,247)]"
                            checked={studentFilter === 'all'}
                            onChange={() => setStudentFilter('all')}
                          />
                          <label htmlFor="student-all" className="ml-2 block text-sm text-gray-700">
                            All Clients
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="student-only" 
                            name="studentFilter" 
                            className="h-4 w-4 text-[rgb(174,175,247)] border-gray-300 focus:ring-[rgb(174,175,247)]"
                            checked={studentFilter === 'student'}
                            onChange={() => setStudentFilter('student')}
                          />
                          <label htmlFor="student-only" className="ml-2 block text-sm text-gray-700">
                            Students Only
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="non-student-only" 
                            name="studentFilter" 
                            className="h-4 w-4 text-gray-600 border-gray-300 focus:ring-[rgb(174,175,247)]"
                            checked={studentFilter === 'non-student'}
                            onChange={() => setStudentFilter('non-student')}
                          />
                          <label htmlFor="non-student-only" className="ml-2 block text-sm text-gray-700">
                            Non-Students Only
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Session Count
                      </label>
                      <select className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(174,175,247)]">
                        <option value="any">Any</option>
                        <option value="new">New (1-2 sessions)</option>
                        <option value="regular">Regular (3-10 sessions)</option>
                        <option value="long-term">Long-term (10+ sessions)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Primary Concern
                      </label>
                      <select className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(174,175,247)]">
                        <option value="any">Any</option>
                        <option value="anxiety">Anxiety</option>
                        <option value="depression">Depression</option>
                        <option value="stress">Stress</option>
                        <option value="relationships">Relationships</option>
                        <option value="academic">Academic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Last Session
                      </label>
                      <select className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(174,175,247)]">
                        <option value="any">Any time</option>
                        <option value="week">Within last week</option>
                        <option value="month">Within last month</option>
                        <option value="three-months">Within last 3 months</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Client Count */}
              <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">{filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} found</span>
                  <span className="text-xs text-gray-500">
                    (<span className="text-indigo-500">{filteredClients.filter(c => c.anonymous).length}</span> anonymous, <span className="text-indigo-500">{filteredClients.filter(c => !c.anonymous).length}</span> identified, <span className="text-indigo-500">{filteredClients.filter(c => c.student).length}</span> students)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[rgb(174,175,247)]">
                    <option value="name">Name (A-Z)</option>
                    <option value="recent">Recent Activity</option>
                    <option value="sessions">Session Count</option>
                  </select>
                </div>
              </div>

              {/* Client Cards */}
              {filteredClients.length > 0 ? (
                <div className="space-y-4 lg:space-y-6">
                  {filteredClients.map(client => (
                    <ClientCard 
                      key={client.id} 
                      client={client} 
                      onViewDetails={handleViewClientDetails} 
                    />
                  ))}
                </div>
              ) : (
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
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default CounsellorClients;
