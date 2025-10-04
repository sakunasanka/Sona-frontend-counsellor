import React, { useState, useEffect } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { useParams } from 'react-router-dom';
import { getClientDetails, createClientNote, deleteClientNote, updateClientNote, type ClientDetails as APIClientDetails } from '../../api/counsellorAPI';
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  Phone, 
  User, 
  FileText, 
  BarChart2, 
  Shield, 
  PenLine, 
  X,
  Mail,
  MapPin,
  UserCheck,
  FileSymlink,
  Flag
} from 'lucide-react';

interface Note {
  id: number;
  content: string;
  createdAt: string;
  createdBy: string;
  isPrivate: boolean;
  counselorId: number;
}

interface Session {
  id: number;
  date: string;
  dateObject?: Date;  // For date/time picker
  status: 'completed' | 'upcoming' | 'cancelled';
  duration: number; // in minutes
  concerns: string[];
  notes?: string;
  rating?: number;
}

interface ClientDetailsParams {
  clientId: string;
}

const ClientDetails: React.FC = () => {
  const { clientId } = useParams<keyof ClientDetailsParams>() as ClientDetailsParams;
  const quickNoteRef = React.useRef<HTMLTextAreaElement>(null);
  const recentNotesRef = React.useRef<HTMLDivElement>(null);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'sessions' | 'details'>('overview');
  const [newNote, setNewNote] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  
  // Edit note state
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingPrivacy, setEditingPrivacy] = useState(false);
  
  // Session modals state
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      content: "MY NOTE (Nilukshi): Client showed significant progress in anxiety management techniques.",
      createdAt: "June 28, 2025", 
      createdBy: "Nilukshi Karunaratne",
      isPrivate: false,
      counselorId: 38  // My notes - should show edit/delete buttons
    },
    {
      id: 2,
      content: "OTHER'S NOTE (Naruto): Client mentioned difficulty with workplace stress.",
      createdAt: "June 20, 2025",
      createdBy: "Uzumaki Naruto", 
      isPrivate: false,
      counselorId: 1   // Other's notes - should NOT show edit/delete buttons (but visible because public)
    },
    {
      id: 3,
      content: "MY PRIVATE NOTE (Nilukshi): Confidential observation about client's progress.",
      createdAt: "June 12, 2025",
      createdBy: "Nilukshi Karunaratne",
      isPrivate: true,
      counselorId: 38  // My private note - should show edit/delete buttons
    }
  ]);
  
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      date: "June 28, 2025 • 10:00 AM",
      status: 'completed',
      duration: 50,
      concerns: ["Anxiety", "Stress"],
      notes: "Focused on mindfulness techniques and breathing exercises",
      rating: 5
    },
    {
      id: 2,
      date: "June 20, 2025 • 11:30 AM",
      status: 'completed',
      duration: 50,
      concerns: ["Work Stress", "Time Management"],
      notes: "Discussed workplace challenges and coping strategies",
      rating: 4
    },
    {
      id: 3,
      date: "June 12, 2025 • 2:00 PM",
      status: 'completed',
      duration: 60,
      concerns: ["Initial Assessment"],
      notes: "Initial assessment session. Client seems motivated for therapy.",
      rating: 4
    },
    {
      id: 4,
      date: "July 10, 2025 • 10:00 AM",
      status: 'upcoming',
      duration: 50,
      concerns: ["Anxiety", "Stress", "Sleep Issues"],
      notes: "Focus on sleep hygiene and relaxation techniques"
    }
  ]);

  // Define client types that can accommodate both anonymous and identified clients
  interface BaseClient {
    id: number;
    sessionCount: number;
    lastSession: string;
    nextSession?: string;
    concerns: string[];
    status: 'active' | 'new' | 'inactive';
    anonymous: boolean;
    student: boolean;
    institution?: string;
    joinDate: string;
    profileImage?: string;
    nickname?: string;
  }

  interface IdentifiedClient extends BaseClient {
    anonymous: false;
    name: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    address: string;
    program?: string;
    year?: string;
    referredBy?: string;
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  }

  interface AnonymousClient extends BaseClient {
    anonymous: true;
    nickname: string;
  }

  type Client = IdentifiedClient | AnonymousClient;

  // Mock client data - in a real application, this would be fetched from an API
  const clients: Client[] = [
    {
      id: 1,
      name: "Sarath Perera",
      profileImage: "/assets/images/student-photo.png",
      age: 22,
      gender: "Female",
      email: "sarath.perera@example.com",
      phone: "(071) 123-4567",
      address: "123 Temple Road, Colombo 07",
      sessionCount: 8,
      lastSession: "2 days ago",
      nextSession: "July 10, 10:00 AM",
      concerns: ["Anxiety", "Stress", "Academic Pressure", "Sleep Issues"],
      status: 'active',
      anonymous: false,
      student: true,
      institution: "Colombo University",
      program: "Computer Science",
      year: "3rd Year",
      joinDate: "May 15, 2025",
      referredBy: "University Counseling Center",
      emergencyContact: {
        name: "Ranindu Perera",
        relationship: "Father",
        phone: "(071) 987-6543"
      }
    },
    {
      id: 3,
      nickname: "Sunshine",
      profileImage: "",
      sessionCount: 1,
      lastSession: "Yesterday",
      nextSession: "July 7, 2:00 PM",
      concerns: ["Social Anxiety", "Self-esteem"],
      status: 'new',
      anonymous: true,
      student: true,
      joinDate: "June 25, 2025"
    }
  ];

  // State for client data and loading
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform API client data to component format
  const transformApiClient = (apiClient: APIClientDetails): Client => {
    const baseClient = {
      id: apiClient.id,
      sessionCount: apiClient.total_sessions,
      lastSession: apiClient.last_session ? new Date(apiClient.last_session).toLocaleDateString() : 'No sessions',
      nextSession: apiClient.next_appointment ? new Date(apiClient.next_appointment).toLocaleDateString() + ' at ' + new Date(apiClient.next_appointment).toLocaleTimeString() : undefined,
      concerns: apiClient.concerns || [],
      status: apiClient.status,
      anonymous: apiClient.is_anonymous,
      student: true, // Assuming all clients are students based on student_id field
      institution: apiClient.institution || 'University',
      joinDate: apiClient.join_date ? new Date(apiClient.join_date).toLocaleDateString() : 'Unknown',
      profileImage: apiClient.avatar || '/assets/images/student-photo.png',
    };

    if (apiClient.is_anonymous) {
      return {
        ...baseClient,
        anonymous: true,
        nickname: `Student ${apiClient.student_id}`,
      } as AnonymousClient;
    } else {
      return {
        ...baseClient,
        anonymous: false,
        name: apiClient.name,
        age: apiClient.age || 22,
        gender: apiClient.gender || 'Unknown',
        email: apiClient.email || 'N/A',
        phone: apiClient.phone || 'N/A',
        address: apiClient.address || 'N/A',
        program: apiClient.program || 'Computer Science',
        year: apiClient.year || '3rd Year',
        referredBy: apiClient.referred_by || 'University Counseling Center',
        emergencyContact: apiClient.emergency_contact ? {
          name: apiClient.emergency_contact.name,
          relationship: apiClient.emergency_contact.relationship,
          phone: apiClient.emergency_contact.phone
        } : {
          name: 'Contact Person',
          relationship: 'Guardian',
          phone: 'N/A'
        }
      } as IdentifiedClient;
    }
  };

  // Fetch client details from API
  const fetchClientDetails = async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Set default counselor ID for testing if not already set
      if (!localStorage.getItem('counsellor_id')) {
        localStorage.setItem('counsellor_id', '38'); // Your actual counselor ID
      }
      
      const response = await getClientDetails(clientId);
      
      if (response.success && response.data) {
        const transformedClient = transformApiClient(response.data);
        setCurrentClient(transformedClient);
        
        // Transform API notes to component format and apply privacy filtering
        const currentCounsellorId = parseInt(localStorage.getItem('counsellor_id') || '38'); // Your actual counselor ID
        const transformedNotes: Note[] = response.data.notes
          .filter(note => {
            // Show all public notes, but only private notes created by current counselor
            if (!note.is_private) return true;
            return note.counselor_id === currentCounsellorId;
          })
          .map(note => {
            // Handle date properly with fallback
            const createdDate = note.created_at ? new Date(note.created_at) : new Date();
            const formattedDate = isNaN(createdDate.getTime()) ? 
              new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) :
              createdDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            
            return {
              id: note.id,
              content: note.content,
              createdAt: formattedDate,
              createdBy: note.created_by,
              isPrivate: note.is_private,
              counselorId: note.counselor_id
            };
          });
        setNotes(transformedNotes);

        // Transform API sessions to component format
        const transformedSessions: Session[] = response.data.sessions.map(session => ({
          id: session.id,
          date: new Date(session.date).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }) + ' • ' + new Date(session.date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          status: session.status === 'scheduled' ? 'upcoming' : 
                  session.status === 'no_show' ? 'cancelled' : 
                  session.status as 'completed' | 'cancelled',
          duration: session.duration,
          concerns: session.concerns,
          notes: session.notes || '',
          rating: session.rating
        }));
        setSessions(transformedSessions);
      }
    } catch (err) {
      console.error('Error fetching client details:', err);
      setError('Failed to load client details. Please try again.');
      // Fallback to first mock client for demo purposes
      setCurrentClient(clients[0]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch client details on component mount
  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleAddNote = async () => {
    if (newNote.trim() && clientId) {
      try {
        const response = await createClientNote(clientId, {
          content: newNote,
          isPrivate: isPrivateNote
        });

        if (response.success) {
          console.log('API Response for new note:', response.data);
          console.log('Full response object:', JSON.stringify(response, null, 2));
          
          // Handle date properly with robust fallback
          let formattedDate;
          try {
            if (response.data.created_at) {
              const createdDate = new Date(response.data.created_at);
              if (!isNaN(createdDate.getTime())) {
                formattedDate = createdDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                });
              } else {
                throw new Error('Invalid date from API');
              }
            } else {
              throw new Error('No created_at field from API');
            }
          } catch (error) {
            console.warn('Date parsing error:', error, 'Using current date as fallback');
            formattedDate = new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            });
          }
            
          console.log('Date handling - original:', response.data.created_at, 'formatted:', formattedDate);
          
          // Validate required fields
          if (!response.data.id || !response.data.content || !response.data.created_by) {
            console.error('Missing required fields in API response:', {
              id: response.data.id,
              content: response.data.content,
              created_by: response.data.created_by,
              counselor_id: response.data.counselor_id
            });
            throw new Error('Incomplete note data from API');
          }
            
          const newNoteObj: Note = {
            id: response.data.id,
            content: response.data.content,
            createdAt: formattedDate,
            createdBy: response.data.created_by,
            isPrivate: response.data.is_private,
            counselorId: response.data.counselor_id
          };
          
          setNotes([newNoteObj, ...notes]);
          setNewNote('');
          setIsPrivateNote(false);
        }
      } catch (error) {
        console.error('Error creating note:', error);
        
        // If note creation failed due to incomplete response, try to refresh all client details
        if (error instanceof Error && error.message?.includes('Incomplete note data')) {
          console.log('Refreshing client details due to incomplete note response...');
          try {
            await fetchClientDetails();
            setNewNote('');
            setIsPrivateNote(false);
            return; // Exit early since fetchClientDetails will handle the state update
          } catch (refreshError) {
            console.error('Failed to refresh client details:', refreshError);
          }
        }
        // Fallback to local note creation for demo purposes
        const currentCounsellorId = parseInt(localStorage.getItem('counsellor_id') || '38');
        const newNoteObj: Note = {
          id: notes.length + 1,
          content: newNote,
          createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          createdBy: "Dr. Counsellor", // This would be dynamic in a real app
          isPrivate: isPrivateNote,
          counselorId: currentCounsellorId
        };
        
        setNotes([newNoteObj, ...notes]);
        setNewNote('');
        setIsPrivateNote(false);
      }
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    // Check if current counselor is authorized to delete this note
    const noteToDelete = notes.find(note => note.id === noteId);
    const currentCounsellorId = parseInt(localStorage.getItem('counsellor_id') || '38');
    
    if (noteToDelete && noteToDelete.counselorId !== currentCounsellorId) {
      alert('You can only delete notes that you created.');
      return;
    }

    try {
      await deleteClientNote(clientId, noteId);
      
      // Remove the note from local state
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
    setEditingPrivacy(note.isPrivate);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent('');
    setEditingPrivacy(false);
  };

  const handleSaveEdit = async () => {
    if (!editingNoteId || !editingContent.trim()) return;

    const currentCounsellorId = parseInt(localStorage.getItem('counsellor_id') || '38');
    const noteToEdit = notes.find(note => note.id === editingNoteId);
    
    if (noteToEdit && noteToEdit.counselorId !== currentCounsellorId) {
      alert('You can only edit notes that you created.');
      return;
    }

    try {
      console.log('Updating note:', {
        clientId,
        noteId: editingNoteId,
        endpoint: `PUT /api/counsellor/clients/${clientId}/notes/${editingNoteId}`,
        payload: { content: editingContent, isPrivate: editingPrivacy }
      });

      const response = await updateClientNote(clientId, editingNoteId, {
        content: editingContent,
        isPrivate: editingPrivacy
      });

      console.log('Update note response:', response);

      if (response.success) {
        // Update the note in local state
        setNotes(notes.map(note => 
          note.id === editingNoteId 
            ? { ...note, content: editingContent, isPrivate: editingPrivacy }
            : note
        ));
        
        // Clear editing state
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note. Please try again.');
    }
  };
  
  const handleRemoveConcern = (index: number) => {
    if (!currentClient) return;
    
    const updatedConcerns = [...currentClient.concerns];
    updatedConcerns.splice(index, 1);
    
    // In a real app, you would update this on the backend as well
    setCurrentClient({
      ...currentClient,
      concerns: updatedConcerns
    });
  };

  // Session handlers
  const handleViewSessionDetails = (session: Session) => {
    setSelectedSession(session);
    setIsDetailsModalOpen(true);
  };

  const handleCancelSession = (session: Session) => {
    setSelectedSession(session);
    setIsCancelModalOpen(true);
  };

  const confirmCancelSession = () => {
    if (selectedSession) {
      // In a real app, you would make an API call here
      const updatedSession = { 
        ...selectedSession, 
        status: 'cancelled' as const,
        cancellationReason: cancelReason
      };
      
      // This would be replaced with an API call and state update
      console.log("Session cancelled:", updatedSession);
      
      // Show confirmation message (in a real app)
      alert("Session cancelled successfully!");
      
      // Close modal
      setIsCancelModalOpen(false);
      setSelectedSession(null);
      setCancelReason('');
    }
  };
  
  const renderOverviewTab = () => {
    if (!currentClient) return null;
    
    return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{currentClient.sessionCount}</p>
            </div>
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Last session {currentClient.lastSession}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Next Session</p>
              <p className="text-lg font-semibold text-gray-900">{currentClient.nextSession || "None scheduled"}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {currentClient.nextSession ? "Upcoming appointment" : "Schedule a session"}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Client Since</p>
              <p className="text-lg font-semibold text-gray-900">{currentClient.joinDate}</p>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {Math.floor((new Date().getTime() - new Date(currentClient.joinDate).getTime()) / (1000 * 3600 * 24))} days
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Status</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{currentClient.status}</p>
            </div>
            <div className={`p-2 rounded-lg ${
              currentClient.status === 'active' ? 'bg-[rgb(174,175,247)] bg-opacity-25' : 
              currentClient.status === 'new' ? 'bg-blue-50' :
              'bg-orange-50'
            }`}>
              <span className={`w-6 h-6 ${
                currentClient.status === 'active' ? 'text-indigo-500' : 
                currentClient.status === 'new' ? 'text-blue-500' :
                'text-orange-500'
              }`}>
                {currentClient.status === 'active' && <UserCheck className="w-6 h-6" />}
                {currentClient.status === 'new' && <User className="w-6 h-6" />}
                {currentClient.status === 'inactive' && <Clock className="w-6 h-6" />}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {currentClient.status === 'active' ? 'Regular client' : 
             currentClient.status === 'new' ? 'New client' : 'Inactive client'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            className="flex flex-col items-center justify-center bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg transition-colors"
            onClick={() => window.location.href = `/counsellor/chats?clientId=${clientId}`}
          >
            <MessageCircle className="w-6 h-6 text-indigo-500 mb-2" />
            <span className="text-sm text-gray-800">Message</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors"
            onClick={() => {
              if (recentNotesRef.current) {
                recentNotesRef.current.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                  if (quickNoteRef.current) {
                    quickNoteRef.current.focus();
                  }
                }, 500); // Small delay to ensure scroll completes before focus
              }
            }}
          >
            <FileText className="w-6 h-6 text-purple-500 mb-2" />
            <span className="text-sm text-gray-800">Add Note</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors"
            onClick={() => setActiveTab('sessions')}
          >
            <Calendar className="w-6 h-6 text-green-500 mb-2" />
            <span className="text-sm text-gray-800">Schedule</span>
          </button>
          <button 
            className="flex flex-col items-center justify-center bg-amber-50 hover:bg-amber-100 p-4 rounded-lg transition-colors"
            onClick={() => setActiveTab('details')}
          >
            <FileSymlink className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-sm text-gray-800">Resources</span>
          </button>
        </div>
      </div>

      {/* Recent Notes */}
      <div ref={recentNotesRef} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Notes</h3>
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            onClick={() => setActiveTab('notes')}
          >
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {notes.slice(0, 2).map(note => (
            <div key={note.id} className="border-l-4 border-indigo-300 pl-4 py-2">
              <p className="text-gray-700">{note.content}</p>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">{note.createdAt}</span>
                  {note.isPrivate && (
                    <span className="ml-2 flex items-center text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3 mr-1" />
                      Private
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{note.createdBy}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <textarea
            ref={quickNoteRef}
            placeholder="Add a quick note..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            rows={2}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          ></textarea>
          
          <div className="flex justify-between mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="privateQuickNote"
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                checked={isPrivateNote}
                onChange={() => setIsPrivateNote(!isPrivateNote)}
              />
              <label htmlFor="privateQuickNote" className="ml-2 text-sm text-gray-600">
                Mark as private
              </label>
            </div>
            
            <button
              className={`px-4 py-2 ${!newNote.trim() ? 'bg-gray-300 cursor-not-allowed opacity-50' : 'bg-primary hover:bg-opacity-90'} text-white rounded-md text-sm font-medium flex items-center transition-all`}
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              style={{pointerEvents: newNote.trim() ? 'auto' : 'none'}}
            >
              <PenLine className="w-4 h-4 mr-2" />
              Save Note
            </button>
          </div>
        </div>
      </div>
      
      {/* Primary Concerns */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Primary Concerns</h3>
        
        <div className="flex flex-wrap gap-2">
          {currentClient.concerns.map((concern, idx) => (
            <div 
              key={idx} 
              className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg flex items-center group"
            >
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
              <span>{concern}</span>
              <button 
                onClick={() => handleRemoveConcern(idx)}
                className="ml-2 w-5 h-5 rounded-full bg-white bg-opacity-50 text-gray-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg border border-dashed border-gray-300 flex items-center">
            <span className="text-lg mr-1">+</span>
            <span>Add Concern</span>
          </button>
        </div>
      </div>
    </div>
    );
  };

  const renderNotesTab = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Client Notes</h3>
      
      <div className="mb-6">
        <textarea
          placeholder="Add a new note about this client..."
          className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          rows={4}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        ></textarea>
        
        <div className="flex justify-between mt-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="privateNote"
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              checked={isPrivateNote}
              onChange={() => setIsPrivateNote(!isPrivateNote)}
            />
            <label htmlFor="privateNote" className="ml-2 text-sm text-gray-600 flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1 text-red-500" />
              Mark as private note (only visible to you)
            </label>
          </div>
          
          <button
            className={`px-4 py-2 ${!newNote.trim() ? 'bg-gray-300 cursor-not-allowed opacity-50' : 'bg-primary hover:bg-opacity-90'} text-white rounded-md text-sm font-medium flex items-center transition-all`}
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            style={{pointerEvents: newNote.trim() ? 'auto' : 'none'}}
          >
            <PenLine className="w-4 h-4 mr-2" />
            Save Note
          </button>
        </div>
      </div>
      
      <div className="space-y-5">
        {notes.filter(note => {
          // Show all public notes, but only private notes created by current counselor
          if (!note.isPrivate) return true;
          // For private notes, only show if created by current counselor
          const currentCounsellorId = parseInt(localStorage.getItem('counsellor_id') || '38');
          return note.counselorId === currentCounsellorId;
        }).map(note => (
          <div key={note.id} className={`border-l-4 ${note.isPrivate ? 'border-red-300' : 'border-indigo-300'} pl-4 py-3`}>
            {editingNoteId === note.id ? (
              <div className="space-y-3">
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`editPrivate${note.id}`}
                      checked={editingPrivacy}
                      onChange={(e) => setEditingPrivacy(e.target.checked)}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor={`editPrivate${note.id}`} className="ml-2 text-sm text-gray-600 flex items-center">
                      <Shield className="w-3.5 h-3.5 mr-1 text-red-500" />
                      Private note
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{note.content}</p>
            )}
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">{note.createdAt}</span>
                {note.isPrivate && (
                  <span className="ml-2 flex items-center text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                    <Shield className="w-3 h-3 mr-1" />
                    Private Note
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">{note.createdBy}</span>
            </div>
            {(() => {
              const currentCounsellorId = parseInt(localStorage.getItem('counsellor_id') || '38');
              
              // Very strict ownership check - only show buttons for notes that match exactly
              if (note.counselorId && note.counselorId === currentCounsellorId) {
                return (
                  <div className="mt-2 flex items-center space-x-2 text-xs">
                    <button 
                      onClick={() => handleEditNote(note)}
                      className="text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <PenLine className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 hover:text-red-700 flex items-center"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Delete
                    </button>
                  </div>
                );
              } else {
                return null;
              }
            })()}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSessionsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">All Sessions</h3>
          <button 
            className="px-4 py-2 bg-primary hover:bg-opacity-90 text-white rounded-md text-sm font-medium flex items-center"
            onClick={() => window.location.href = '/counsellor-calendar'}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topics
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{session.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${session.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        session.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full
                        ${session.status === 'completed' ? 'bg-green-600' : 
                          session.status === 'upcoming' ? 'bg-blue-600' :
                          'bg-red-600'}`}
                      ></span>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{session.duration} min</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {session.concerns.map((concern, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {concern}
                        </span>
                      )).slice(0, 2)}
                      {session.concerns.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{session.concerns.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.rating ? (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < session.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded flex items-center transition-colors"
                        onClick={() => handleViewSessionDetails(session)}
                        aria-label="View session details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Details
                      </button>
                      {session.status === 'upcoming' && (
                        <button 
                          className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded flex items-center transition-colors"
                          onClick={() => handleCancelSession(session)}
                          aria-label="Cancel session"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDetailsTab = () => {
    if (!currentClient) return null;
    
    return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          
          {currentClient.anonymous ? (
            <div className="bg-primary bg-opacity-5 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-800">Anonymous Profile</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    This client has opted for anonymity. Personal details are hidden to protect their privacy.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                {!currentClient.anonymous ? (
                  <p className="text-gray-900">{currentClient.name}</p>
                ) : (
                  <p className="text-gray-900">
                    <span className="italic">{currentClient.nickname}</span>
                    <span className="ml-2 text-xs bg-primary bg-opacity-10 text-primary px-2 py-0.5 rounded-full">
                      Nickname
                    </span>
                  </p>
                )}
              </div>
              
              {!currentClient.anonymous && (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Age</label>
                    <p className="text-gray-900">{currentClient.age} years</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                    <p className="text-gray-900">{currentClient.gender}</p>
                  </div>
                </>
              )}
              
              {currentClient.student && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Institution</label>
                  <p className="text-gray-900 flex items-center">
                    <span>{currentClient.institution}</span>
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-[rgb(174,175,247)] bg-opacity-25 text-indigo-500 text-xs rounded-full">
                      Student
                    </span>
                  </p>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Client Since</label>
                <p className="text-gray-900">{currentClient.joinDate}</p>
              </div>
            </div>
            
            <div>
              {!currentClient.anonymous && (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      <div className="flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        Email Address
                      </div>
                    </label>
                    <p className="text-gray-900">{currentClient.email}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      <div className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        Phone Number
                      </div>
                    </label>
                    <p className="text-gray-900">{currentClient.phone}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        Address
                      </div>
                    </label>
                    <p className="text-gray-900">{currentClient.address}</p>
                  </div>
                  
                  {currentClient.emergencyContact && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Emergency Contact</label>
                      <p className="text-gray-900">{currentClient.emergencyContact.name}</p>
                      <p className="text-gray-600 text-sm">{currentClient.emergencyContact.relationship}</p>
                      <p className="text-gray-600 text-sm">{currentClient.emergencyContact.phone}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {currentClient.anonymous && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Flag className="w-4 h-4 mr-2 text-amber-500" />
                <p>For ethical and privacy reasons, contact information and personal details are not visible for anonymous clients.</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Session Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Therapy Progress</h3>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Session Attendance</span>
              <span className="text-sm font-medium text-gray-900">100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Reported Mood</span>
              <span className="text-sm font-medium text-gray-900">Improving</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Session Ratings</h4>
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 w-8">5★</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">60%</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 w-8">4★</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">30%</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 w-8">3★</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">10%</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 w-8">2★</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">0%</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 w-8">1★</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Section - Full Width */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-primary" />
          Detailed Analytics
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Timeline */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Session Timeline</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="h-36 flex items-end justify-between space-x-1">
                {[70, 45, 80, 65, 90, 75, 85].map((height, idx) => (
                  <div 
                    key={idx} 
                    className="bg-buttonBlue-500 opacity-80 hover:opacity-100 rounded-t w-full transition-all"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-xs text-gray-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>
          </div>
          
          {/* Primary Concerns Distribution */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Primary Concerns Distribution</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary h-4 rounded-full" style={{ width: '40%' }}></div>
                <span className="text-sm text-gray-700">Anxiety (40%)</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-buttonBlue-500 h-4 rounded-full" style={{ width: '30%' }}></div>
                <span className="text-sm text-gray-700">Stress (30%)</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-buttonGreen-500 h-4 rounded-full" style={{ width: '20%' }}></div>
                <span className="text-sm text-gray-700">Sleep Issues (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-buttonOrange-500 h-4 rounded-full" style={{ width: '10%' }}></div>
                <span className="text-sm text-gray-700">Other (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Let the Sidebar component handle its own positioning */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={closeSidebar} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={toggleSidebar} />

          <div className="p-4 lg:p-6">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading client details...</span>
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
                    <h3 className="text-sm font-medium text-red-800">Error loading client details</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    <button 
                      onClick={fetchClientDetails}
                      className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Client Profile Header - Only show when data is available */}
            {currentClient && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex items-center">
                <div className={`w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ${currentClient.anonymous ? 'bg-primary bg-opacity-10 flex items-center justify-center' : 'border-2 border-gray-100'}`}>
                  {currentClient.anonymous ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <img 
                      src={currentClient.profileImage} 
                      alt={currentClient.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="ml-4">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentClient.anonymous 
                        ? (currentClient.nickname || 'Anonymous Client') 
                        : currentClient.name
                      }
                    </h1>
                    {currentClient.anonymous && (
                      <span className="px-2 py-0.5 rounded-full bg-primary bg-opacity-10 text-primary text-xs font-medium">
                        Anonymous
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      currentClient.status === 'active' ? 'bg-primary bg-opacity-10 text-primary' : 
                      currentClient.status === 'new' ? 'bg-primary bg-opacity-10 text-primary' : 
                      'bg-primary bg-opacity-10 text-primary'
                    }`}>
                      {currentClient.status === 'active' ? 'Active' : 
                      currentClient.status === 'new' ? 'New Client' : 
                      'Inactive'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    {!currentClient.anonymous && (
                      <span className="text-gray-600 text-sm">{currentClient.age} yrs • {currentClient.gender}</span>
                    )}
                    {currentClient.student && (
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 bg-primary bg-opacity-10 text-primary text-xs rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                          </svg>
                          Student
                        </span>
                        {currentClient.institution && (
                          <span className="text-xs text-gray-500">• {currentClient.institution}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="mt-6 border-b border-gray-200">
              <nav className="flex space-x-6 overflow-x-auto pb-2">
                <button 
                  className={`pb-2 text-sm font-medium -mb-px ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`pb-2 text-sm font-medium -mb-px ${activeTab === 'notes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('notes')}
                >
                  Notes
                </button>
                <button 
                  className={`pb-2 text-sm font-medium -mb-px ${activeTab === 'sessions' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('sessions')}
                >
                  Sessions
                </button>
                <button 
                  className={`pb-2 text-sm font-medium -mb-px ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('details')}
                >
                  Client Details
                </button>
              </nav>
            </div>
          </div>
          )}
          
          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'notes' && renderNotesTab()}
            {activeTab === 'sessions' && renderSessionsTab()}
            {activeTab === 'details' && renderDetailsTab()}
          </div>

          {/* Session Details Modal */}
          {isDetailsModalOpen && selectedSession && (
            <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-6">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Session Details</h3>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => setIsDetailsModalOpen(false)}
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                      <p className="text-gray-900 font-medium">{selectedSession.date}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                      <p className="text-gray-900">{selectedSession.duration} minutes</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${selectedSession.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            selectedSession.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'}`}
                        >
                          <span className={`w-1.5 h-1.5 mr-1.5 rounded-full
                            ${selectedSession.status === 'completed' ? 'bg-green-600' : 
                              selectedSession.status === 'upcoming' ? 'bg-blue-600' :
                              'bg-red-600'}`}
                        ></span>
                        {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Topics/Concerns</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedSession.concerns.map((concern, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {selectedSession.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Session Notes</h4>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700">
                          {selectedSession.notes}
                        </div>
                      </div>
                    )}
                    
                    {selectedSession.rating && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Client Rating</h4>
                        <div className="mt-1 flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-5 h-5 ${i < selectedSession.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Added additional bottom padding instead of a footer line */}
                  <div className="mt-8"></div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Session Modal removed */}

          {/* Cancel Session Modal */}
          {isCancelModalOpen && selectedSession && (
            <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-6">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Cancel Session</h3>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => setIsCancelModalOpen(false)}
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-700">
                      Are you sure you want to cancel the session scheduled for <span className="font-medium">{selectedSession.date}</span>?
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation</label>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Please provide a reason for cancellation..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-4">
                    <button
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors"
                      onClick={() => setIsCancelModalOpen(false)}
                    >
                      Keep Session
                    </button>
                    <button
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                      onClick={confirmCancelSession}
                    >
                      Cancel Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>  
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
