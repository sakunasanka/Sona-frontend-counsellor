import React, { useState, useEffect } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { FlashMessage } from '../../components/ui';
import { useParams } from 'react-router-dom';
import { getClientDetails, createClientNote, deleteClientNote, updateClientNote, addClientConcern, removeClientConcern, getClientMoodAnalysis, getClientPHQ9Analysis, getSessions, type ClientDetails as APIClientDetails, type MoodAnalysisResponse, type PHQ9AnalysisResponse, getClientEarnings } from '../../api/counsellorAPI';
import { MoodChart, PHQ9Chart } from '../../components/charts';
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
  Flag,
  FileDown,
  CalendarDays,
  Brain,
  TrendingUp
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
  price?: number; // Session fee
}

interface ClientDetailsParams {
  clientId: string;
}

const ClientDetails: React.FC = () => {
  const { clientId } = useParams<keyof ClientDetailsParams>() as ClientDetailsParams;
  const quickNoteRef = React.useRef<HTMLTextAreaElement>(null);
  const recentNotesRef = React.useRef<HTMLDivElement>(null);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'sessions' | 'details' | 'mood'>('overview');
  const [newNote, setNewNote] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  
  // Edit note state
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingPrivacy, setEditingPrivacy] = useState(false);
  
  // Add concern state
  const [isAddingConcern, setIsAddingConcern] = useState(false);
  const [newConcernText, setNewConcernText] = useState('');
  
  // Session modals state
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  // Report generation state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportGenerating, setReportGenerating] = useState(false);
  
  // Mood analysis state
  const [moodData, setMoodData] = useState<MoodAnalysisResponse | null>(null);
  const [moodLoading, setMoodLoading] = useState(false);
  const [moodError, setMoodError] = useState<string | null>(null);
  
  // Month navigation state for mood analysis
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showAllTime, setShowAllTime] = useState<boolean>(true);
  
  // PHQ-9 analysis state
  const [phq9Data, setPhq9Data] = useState<PHQ9AnalysisResponse | null>(null);
  const [phq9Loading, setPhq9Loading] = useState(false);
  const [phq9Error, setPhq9Error] = useState<string | null>(null);
  
  // Mood analysis sub-tab state
  const [moodSubTab, setMoodSubTab] = useState<'phq9' | 'mood'>('phq9');
  
  // Flash message state
  const [flashMessage, setFlashMessage] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });
  
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
    earnings?: number;
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
      profileImage: "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png",
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
      profileImage: apiClient.avatar || 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png',
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
        console.log('Client details API response:', response.data);
        console.log('Client concerns from API:', response.data.concerns);
        
        const transformedClient = transformApiClient(response.data);
        console.log('Transformed client concerns:', transformedClient.concerns);
        
        // Fetch earnings data
        try {
          const earningsResponse = await getClientEarnings(parseInt(clientId));
          console.log('Earnings response:', earningsResponse);
          transformedClient.earnings = earningsResponse.totalEarnings;
        } catch (earningsError) {
          console.warn('Could not fetch earnings data:', earningsError);
          transformedClient.earnings = 0;
        }
        
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

        // Fetch sessions with price data from the sessions API
        try {
          const counselorId = parseInt(localStorage.getItem('counsellor_id') || '38');
          const sessionsResponse = await getSessions(counselorId);
          console.log('Sessions API response:', sessionsResponse);
          
          // Filter sessions for this specific client
          const clientSessions = sessionsResponse.filter(session => session.userId === parseInt(clientId));
          console.log('Filtered client sessions:', clientSessions);
          
          // Transform API sessions to component format with price data
          const transformedSessions: Session[] = clientSessions.map(session => ({
            id: session.id,
            date: new Date(session.date + 'T' + session.timeSlot).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            }) + ' • ' + new Date(session.date + 'T' + session.timeSlot).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            status: session.status === 'scheduled' ? 'upcoming' : 
                    session.status === 'no-show' ? 'cancelled' : 
                    session.status as 'completed' | 'cancelled',
            duration: session.duration,
            concerns: [], // Sessions API doesn't include concerns, using empty array
            notes: session.notes || '',
            rating: undefined, // Sessions API doesn't include rating
            price: session.price
          }));
          
          console.log('Transformed sessions:', transformedSessions);
          setSessions(transformedSessions);
        } catch (sessionsError) {
          console.warn('Could not fetch sessions with price data, using client details sessions:', sessionsError);
          // Fallback to client details sessions
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
            rating: session.rating,
            price: session.price
          }));
          setSessions(transformedSessions);
        }
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

  // Load mood analysis data
  const fetchMoodAnalysis = async () => {
    if (!clientId) return;
    
    try {
      setMoodLoading(true);
      setMoodError(null);
      
      const moodResponse = await getClientMoodAnalysis(
        clientId, 
        showAllTime ? undefined : selectedMonth, 
        showAllTime ? undefined : selectedYear
      );
      setMoodData(moodResponse);
      
    } catch (err) {
      console.error('Error fetching mood analysis:', err);
      setMoodError('Failed to load mood analysis data. Please try again.');
    } finally {
      setMoodLoading(false);
    }
  };

  // Load PHQ-9 analysis data
  const fetchPHQ9Analysis = async () => {
    if (!clientId) return;
    
    try {
      setPhq9Loading(true);
      setPhq9Error(null);
      
      const phq9Response = await getClientPHQ9Analysis(clientId);
      setPhq9Data(phq9Response);
      
    } catch (err) {
      console.error('Error fetching PHQ-9 analysis:', err);
      setPhq9Error('Failed to load PHQ-9 analysis data. Please try again.');
    } finally {
      setPhq9Loading(false);
    }
  };

  // Fetch client details on component mount
  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  // Load data based on selected mood sub-tab
  useEffect(() => {
    if (activeTab === 'mood' && clientId) {
      if (moodSubTab === 'phq9' && !phq9Data) {
        fetchPHQ9Analysis();
      } else if (moodSubTab === 'mood') {
        fetchMoodAnalysis();
      }
    }
  }, [activeTab, clientId, moodSubTab, showAllTime, selectedMonth, selectedYear]);

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
      showFlashMessage('warning', 'You can only delete notes that you created.');
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
      showFlashMessage('warning', 'You can only edit notes that you created.');
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
      showFlashMessage('error', 'Failed to update note. Please try again.');
    }
  };
  
  const handleRemoveConcern = async (index: number) => {
    if (!currentClient) return;
    
    const concernToRemove = currentClient.concerns[index];
    
    try {
      // Remove concern from backend first
      await removeClientConcern(clientId, concernToRemove);
      
      // Update local state only if backend update succeeds
      const updatedConcerns = [...currentClient.concerns];
      updatedConcerns.splice(index, 1);
      setCurrentClient({
        ...currentClient,
        concerns: updatedConcerns
      });
    } catch (error) {
      console.error('Error removing concern:', error);
      console.error('Error removing concern details:', { 
        clientId, 
        concernToRemove, 
        index, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showFlashMessage('error', `Failed to remove concern: ${errorMessage}. Please try again.`);
    }
  };

  const handleAddConcern = () => {
    setIsAddingConcern(true);
  };

  const handleSaveConcern = async () => {
    if (!newConcernText.trim() || !currentClient) return;

    try {
      // Add concern to backend first
      await addClientConcern(clientId, newConcernText.trim());
      
      // Update local state only if backend update succeeds
      const updatedConcerns = [...currentClient.concerns, newConcernText.trim()];
      setCurrentClient({
        ...currentClient,
        concerns: updatedConcerns
      });

      // Reset add concern state
      setIsAddingConcern(false);
      setNewConcernText('');
    } catch (error) {
      console.error('Error adding concern:', error);
      showFlashMessage('error', 'Failed to add concern. Please try again.');
    }
  };

  const handleCancelAddConcern = () => {
    setIsAddingConcern(false);
    setNewConcernText('');
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
      showFlashMessage('success', 'Session cancelled successfully!');
      
      // Close modal
      setIsCancelModalOpen(false);
      setSelectedSession(null);
      setCancelReason('');
    }
  };

  // Report generation handlers
  const handleOpenReportModal = () => {
    // Set default date range to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    setReportStartDate(startDate.toISOString().split('T')[0]);
    setReportEndDate(endDate.toISOString().split('T')[0]);
    setIsReportModalOpen(true);
  };

  // Flash message helpers
  const showFlashMessage = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setFlashMessage({
      type,
      message,
      isVisible: true
    });
  };

  const hideFlashMessage = () => {
    setFlashMessage(prev => ({ ...prev, isVisible: false }));
  };

  // Function to generate and download mock PDF report
  const generateMockPDF = (clientName: string, startDate: string, endDate: string, sessionsInRange: any[], moodAnalysis?: MoodAnalysisResponse | null, phq9Analysis?: PHQ9AnalysisResponse | null) => {
    // Sessions are already filtered by date range and passed as parameter
    // No notes will be included in the report as per requirement

    // Calculate average rating, handling both data structures
    const ratingsOnly = sessionsInRange.filter(s => s.rating && s.rating > 0);
    const avgRating = ratingsOnly.length > 0 ? 
      (ratingsOnly.reduce((sum, s) => sum + s.rating, 0) / ratingsOnly.length).toFixed(1) : 'N/A';

    // Create HTML content that can be opened in browser and easily printed to PDF
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Report - ${clientName}</title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #4F46E5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #4F46E5;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        
        .header h2 {
            color: #666;
            margin: 10px 0;
            font-size: 20px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-card {
            background: #F8F9FA;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #4F46E5;
        }
        
        .info-card h4 {
            margin: 0 0 10px 0;
            color: #4F46E5;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-card p {
            margin: 0;
            font-weight: 600;
            font-size: 16px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h3 {
            color: #4F46E5;
            border-bottom: 2px solid #E5E7EB;
            padding-bottom: 8px;
            margin-bottom: 20px;
            font-size: 18px;
        }
        
        .session-item, .note-item {
            background: #FAFAFA;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
            border-left: 4px solid #10B981;
        }
        
        .note-item {
            border-left-color: #F59E0B;
        }
        
        .session-item h4 {
            margin: 0 0 10px 0;
            color: #1F2937;
            font-size: 16px;
        }
        
        .session-item p, .note-item p {
            margin: 5px 0;
            color: #4B5563;
        }
        
        .session-item strong, .note-item strong {
            color: #1F2937;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-completed { background: #D1FAE5; color: #065F46; }
        .status-upcoming { background: #DBEAFE; color: #1E40AF; }
        .status-cancelled { background: #FEE2E2; color: #991B1B; }
        
        .privacy-badge {
            display: inline-block;
            padding: 2px 8px;
            background: #FEF3C7;
            color: #92400E;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 10px;
        }
        
        .summary-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-item {
            text-align: center;
            padding: 15px;
            background: #EEF2FF;
            border-radius: 8px;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #4F46E5;
        }
        
        .stat-label {
            font-size: 12px;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #E5E7EB;
            color: #6B7280;
            font-size: 12px;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4F46E5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            z-index: 1000;
        }
        
        .print-button:hover {
            background: #4338CA;
        }
        
        @media print {
            .print-button { display: none; }
        }
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">🖨️ Print to PDF</button>
    
    <div class="header">
        <h1>Client Progress Report</h1>
        <h2>${clientName}</h2>
        <p style="margin: 10px 0; color: #666;">
            Report Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}
        </p>
    </div>
    
    <div class="info-grid">
        <div class="info-card">
            <h4>Report Generated</h4>
            <p>${new Date().toLocaleDateString()}</p>
        </div>
        <div class="info-card">
            <h4>Sessions in Period</h4>
            <p>${sessionsInRange.length}</p>
        </div>
        <div class="info-card">
            <h4>Client Status</h4>
            <p>${currentClient?.status || 'Active'}</p>
        </div>
        <div class="info-card">
            <h4>Total Sessions</h4>
            <p>${currentClient?.sessionCount || 0}</p>
        </div>
    </div>
    
    <div class="section">
        <h3>📋 Client Information</h3>
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px;">
            <p><strong>Client Name:</strong> ${clientName}</p>
            <p><strong>Client Since:</strong> ${currentClient?.joinDate || 'N/A'}</p>
            <p><strong>Primary Concerns:</strong> ${currentClient?.concerns.join(', ') || 'None listed'}</p>
        </div>
    </div>
    
    <div class="section">
        <h3>📅 Sessions Summary</h3>
        ${sessionsInRange.length > 0 ? sessionsInRange.map(session => {
          // Handle both mock data structure and API data structure
          const sessionDate = session.date || new Date(session.createdAt || session.updatedAt).toLocaleDateString();
          const sessionDuration = session.duration || 50; // Default to 50 minutes if not specified
          const sessionStatus = session.status || 'completed';
          const sessionConcerns = session.concerns || session.type ? [session.type] : ['General Session'];
          const sessionNotes = session.notes || '';
          const sessionRating = session.rating || null;
          
          return `
            <div class="session-item">
                <h4>${sessionDate}</h4>
                <p><strong>Status:</strong> <span class="status-badge status-${sessionStatus}">${sessionStatus}</span></p>
                <p><strong>Duration:</strong> ${sessionDuration} minutes</p>
                <p><strong>Topics:</strong> ${Array.isArray(sessionConcerns) ? sessionConcerns.join(', ') : sessionConcerns}</p>
                ${sessionNotes ? `<p><strong>Session Notes:</strong> ${sessionNotes}</p>` : ''}
                ${sessionRating ? `<p><strong>Client Rating:</strong> ${'⭐'.repeat(sessionRating)} (${sessionRating}/5)</p>` : ''}
            </div>
          `;
        }).join('') : '<p style="text-align: center; color: #6B7280; font-style: italic;">No sessions found in the selected date range.</p>'}
    </div>
    
    <div class="section">
        <h3> Summary Statistics</h3>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">${sessionsInRange.filter(s => (s.status === 'completed' || s.status === 'scheduled')).length}</div>
                <div class="stat-label">Completed Sessions</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${avgRating}/5</div>
                <div class="stat-label">Average Rating</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${sessionsInRange.reduce((sum, s) => sum + (s.duration || 50), 0)}</div>
                <div class="stat-label">Total Minutes</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${moodAnalysis ? moodAnalysis.totalEntries : 0}</div>
                <div class="stat-label">Mood Entries</div>
            </div>
        </div>
    </div>
    
    ${moodAnalysis ? `
    <div class="section">
        <h3>🧠 Mood Analysis</h3>
        <div style="background: #F8F9FA; padding: 20px; border-radius: 8px; border-left: 4px solid #7C3AED;">
            <div class="summary-stats" style="margin-bottom: 20px;">
                <div class="stat-item" style="background: #EDE9FE;">
                    <div class="stat-number" style="color: #7C3AED;">${moodAnalysis.totalEntries}</div>
                    <div class="stat-label">Total Entries</div>
                </div>
                <div class="stat-item" style="background: #D1FAE5;">
                    <div class="stat-number" style="color: #059669;">${moodAnalysis.averageMoodScore}/5</div>
                    <div class="stat-label">Average Score</div>
                </div>
                <div class="stat-item" style="background: #FEF3C7;">
                    <div class="stat-number" style="color: #D97706;">${moodAnalysis.recentMoods.length}</div>
                    <div class="stat-label">Recent Entries</div>
                </div>
                <div class="stat-item" style="background: #E0E7FF;">
                    <div class="stat-number" style="color: #4F46E5;">${moodAnalysis.lastUpdated ? new Date(moodAnalysis.lastUpdated).toLocaleDateString() : 'N/A'}</div>
                    <div class="stat-label">Last Updated</div>
                </div>
            </div>
            
            <h4 style="color: #7C3AED; margin: 20px 0 10px 0;">Mood Dimensions:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px;">
                <div style="background: #F0F9FF; padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-weight: bold; font-size: 16px; color: #0369A1;">${moodAnalysis.averageValence}</div>
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Average Valence</div>
                </div>
                <div style="background: #FEF3C7; padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-weight: bold; font-size: 16px; color: #D97706;">${moodAnalysis.averageArousal}</div>
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Average Arousal</div>
                </div>
                <div style="background: #FCE7F3; padding: 10px; border-radius: 6px; text-align: center;">
                    <div style="font-weight: bold; font-size: 16px; color: #BE185D;">${moodAnalysis.averageIntensity}</div>
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Average Intensity</div>
                </div>
            </div>
            
            <h4 style="color: #7C3AED; margin: 20px 0 10px 0;">Mood Distribution:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px;">
                ${Object.entries(moodAnalysis.moodDistribution).map(([mood, count]) => {
                  const moodLabels: Record<string, string> = {
                    'very_sad': 'Very Sad',
                    'sad': 'Sad', 
                    'neutral': 'Neutral',
                    'happy': 'Happy',
                    'very_happy': 'Very Happy'
                  };
                  const moodColors: Record<string, string> = {
                    'very_sad': '#FEE2E2',
                    'sad': '#FED7AA',
                    'neutral': '#FEF3C7',
                    'happy': '#D1FAE5',
                    'very_happy': '#DCFCE7'
                  };
                  return `
                    <div style="background: ${moodColors[mood] || '#F3F4F6'}; padding: 10px; border-radius: 6px; text-align: center;">
                        <div style="font-weight: bold; font-size: 16px;">${count}</div>
                        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${moodLabels[mood] || mood}</div>
                    </div>
                  `;
                }).join('')}
            </div>
            
            ${moodAnalysis.recentMoods.length > 0 ? `
            <h4 style="color: #7C3AED; margin: 20px 0 10px 0;">Recent Mood Entries:</h4>
            <div style="max-height: 200px; overflow-y: auto;">
                ${moodAnalysis.recentMoods
                  .sort((a, b) => new Date(b.local_date).getTime() - new Date(a.local_date).getTime())
                  .slice(0, 10)
                  .map(mood => {
                  const moodLabels: Record<string, string> = {
                    'very_sad': 'Very Sad',
                    'sad': 'Sad',
                    'neutral': 'Neutral', 
                    'happy': 'Happy',
                    'very_happy': 'Very Happy'
                  };
                  const moodColors: Record<string, string> = {
                    'very_sad': 'background: #FEE2E2; color: #991B1B;',
                    'sad': 'background: #FED7AA; color: #9A3412;',
                    'neutral': 'background: #FEF3C7; color: #92400E;',
                    'happy': 'background: #D1FAE5; color: #065F46;',
                    'very_happy': 'background: #DCFCE7; color: #14532D;'
                  };
                  return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                        <span style="font-size: 14px;">${new Date(mood.local_date).toLocaleDateString()}</span>
                        <span style="padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; ${moodColors[mood.mood] || 'background: #F3F4F6; color: #374151;'}">${moodLabels[mood.mood] || mood.mood}</span>
                    </div>
                  `;
                }).join('')}
            </div>
            ` : '<p style="font-style: italic; color: #6B7280;">No recent mood entries available.</p>'}
        </div>
    </div>
    ` : ''}
    
    ${phq9Analysis ? `
    <div class="section">
        <h3>📊 PHQ-9 Depression Assessment</h3>
        <div style="background: #FEF2F2; padding: 20px; border-radius: 8px; border-left: 4px solid #EF4444;">
            <div class="summary-stats" style="margin-bottom: 20px;">
                <div class="stat-item" style="background: #FEE2E2;">
                    <div class="stat-number" style="color: #DC2626;">${phq9Analysis.totalEntries}</div>
                    <div class="stat-label">Total Assessments</div>
                </div>
                <div class="stat-item" style="background: #FEF3C7;">
                    <div class="stat-number" style="color: #D97706;">${phq9Analysis.averageScore}/27</div>
                    <div class="stat-label">Average Score</div>
                </div>
                <div class="stat-item" style="background: #DBEAFE;">
                    <div class="stat-number" style="color: #2563EB;">${phq9Analysis.currentSeverity || 'N/A'}</div>
                    <div class="stat-label">Current Severity</div>
                </div>
                <div class="stat-item" style="background: ${phq9Analysis.hasRiskIndicators ? '#FEE2E2' : '#D1FAE5'};">
                    <div class="stat-number" style="color: ${phq9Analysis.hasRiskIndicators ? '#DC2626' : '#059669'};">${phq9Analysis.hasRiskIndicators ? 'HIGH' : 'LOW'}</div>
                    <div class="stat-label">Risk Level</div>
                </div>
            </div>
            
            <h4 style="color: #EF4444; margin: 20px 0 10px 0;">Severity Trend: 
                <span style="text-transform: capitalize; ${
                  phq9Analysis.severityTrend === 'improving' ? 'color: #059669;' : 
                  phq9Analysis.severityTrend === 'worsening' ? 'color: #DC2626;' : 
                  'color: #D97706;'
                }">${phq9Analysis.severityTrend.replace('_', ' ')}</span>
            </h4>
            
            <h4 style="color: #EF4444; margin: 20px 0 10px 0;">Severity Distribution:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px;">
                ${Object.entries(phq9Analysis.severityDistribution).map(([severity, count]) => {
                  const severityColors: Record<string, string> = {
                    'Minimal': '#D1FAE5',
                    'Mild': '#FEF3C7',
                    'Moderate': '#FED7AA', 
                    'Moderately Severe': '#FECACA',
                    'Severe': '#FEE2E2'
                  };
                  return `
                    <div style="background: ${severityColors[severity] || '#F3F4F6'}; padding: 10px; border-radius: 6px; text-align: center;">
                        <div style="font-weight: bold; font-size: 16px;">${count}</div>
                        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${severity}</div>
                    </div>
                  `;
                }).join('')}
            </div>
            
            ${phq9Analysis.recentEntries.length > 0 ? `
            <h4 style="color: #EF4444; margin: 20px 0 10px 0;">Recent Assessment Scores:</h4>
            <div style="max-height: 200px; overflow-y: auto;">
                ${phq9Analysis.recentEntries.slice(0, 10).map(entry => {
                  const severityColors: Record<string, string> = {
                    'Minimal': 'background: #D1FAE5; color: #065F46;',
                    'Mild': 'background: #FEF3C7; color: #92400E;',
                    'Moderate': 'background: #FED7AA; color: #9A3412;',
                    'Moderately Severe': 'background: #FECACA; color: #991B1B;',
                    'Severe': 'background: #FEE2E2; color: #991B1B;'
                  };
                  return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                        <span style="font-size: 14px;">${new Date(entry.completedAt).toLocaleDateString()}</span>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span style="font-weight: bold;">${entry.totalScore}/27</span>
                            <span style="padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; ${severityColors[entry.severity] || 'background: #F3F4F6; color: #374151;'}">${entry.severity}</span>
                            ${entry.hasItem9Positive ? '<span style="color: #DC2626; font-size: 12px;">⚠️ Suicidal ideation</span>' : ''}
                        </div>
                    </div>
                  `;
                }).join('')}
            </div>
            ` : '<p style="font-style: italic; color: #6B7280;">No recent assessments available.</p>'}
            
            ${phq9Analysis.hasRiskIndicators ? `
            <div style="background: #FEE2E2; border: 2px solid #FECACA; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h5 style="color: #991B1B; margin: 0 0 10px 0; display: flex; align-items: center;">
                    ⚠️ Risk Indicators Detected
                </h5>
                <p style="color: #991B1B; margin: 0; font-size: 14px;">
                    This client has shown indicators requiring clinical attention (severe scores or positive suicidal ideation responses).
                </p>
            </div>
            ` : ''}
        </div>
    </div>
    ` : ''}
    
    <div class="section">
        <h3>📈 Treatment Summary</h3>
        <div style="background: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #0EA5E9;">
            <p>This comprehensive report covers the period from <strong>${new Date(startDate).toLocaleDateString()}</strong> to <strong>${new Date(endDate).toLocaleDateString()}</strong>.</p>
            
            <p>During this period, the client attended <strong>${sessionsInRange.length} session(s)</strong> and demonstrated consistent engagement with the therapeutic process.</p>
            
            <h4 style="color: #0EA5E9; margin: 20px 0 10px 0;">Key Observations:</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Sessions completed: ${sessionsInRange.filter(s => (s.status === 'completed' || s.status === 'scheduled')).length} out of ${sessionsInRange.length}</li>
                <li>Average session rating: ${avgRating}/5 stars</li>
                <li>Total therapy time: ${sessionsInRange.reduce((sum, s) => sum + (s.duration || 50), 0)} minutes</li>
                <li>Mood tracking entries: ${moodAnalysis ? moodAnalysis.totalEntries : 0} recorded</li>
                <li>PHQ-9 assessments: ${phq9Analysis ? phq9Analysis.totalEntries : 0} completed</li>
            </ul>
            
            <p style="margin-top: 20px;">The client has shown commitment to addressing their therapeutic goals and has participated actively in treatment planning and implementation.</p>
        </div>
    </div>
    
    <div class="footer">
        <p><strong>⚠️ CONFIDENTIALITY NOTICE</strong></p>
        <p>This report contains confidential information and is intended solely for professional use in the context of therapeutic care.</p>
        <p style="margin-top: 20px;">
            Generated by: <strong>Sona Counselling System</strong><br>
            Generated on: ${new Date().toLocaleString()}
        </p>
    </div>
</body>
</html>`;

    // Create a Blob with HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${clientName.replace(/\s+/g, '_')}_Report_${startDate}_to_${endDate}.html`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = async () => {
    if (!reportStartDate || !reportEndDate) {
      showFlashMessage('warning', 'Please select both start and end dates for the report.');
      return;
    }

    if (new Date(reportStartDate) > new Date(reportEndDate)) {
      showFlashMessage('warning', 'Start date cannot be after end date.');
      return;
    }

    setReportGenerating(true);

    try {
      console.log('Generating report for client:', clientId);
      console.log('Date range:', reportStartDate, 'to', reportEndDate);
      
      // Fetch sessions for the date range
      let reportSessions: any[] = [];
      if (clientId && currentClient && !currentClient.anonymous) {
        try {
          // Get counselor ID from localStorage or context
          const counselorId = JSON.parse(localStorage.getItem('user') || '{}').id;
          if (counselorId) {
            const allSessions = await getSessions(counselorId, {
              startDate: reportStartDate,
              endDate: reportEndDate
            });
            // Filter sessions for this specific client
            reportSessions = allSessions.filter(session => session.userId === parseInt(clientId));
          }
        } catch (err) {
          console.log('Could not fetch sessions data for report:', err);
          // Fall back to mock sessions filtered by date range
          reportSessions = sessions.filter(s => {
            const sessionDateStr = s.date.split(' • ')[0];
            const sessionDate = new Date(sessionDateStr);
            return sessionDate >= new Date(reportStartDate) && sessionDate <= new Date(reportEndDate);
          });
        }
      } else {
        // For anonymous clients or when API fails, use mock data filtered by date
        reportSessions = sessions.filter(s => {
          const sessionDateStr = s.date.split(' • ')[0];
          const sessionDate = new Date(sessionDateStr);
          return sessionDate >= new Date(reportStartDate) && sessionDate <= new Date(reportEndDate);
        });
      }
      
      // Fetch mood and PHQ-9 data if not already loaded (filtered by date range in analysis)
      let reportMoodData = moodData;
      let reportPHQ9Data = phq9Data;
      
      if (!moodData && clientId) {
        try {
          reportMoodData = await getClientMoodAnalysis(clientId);
          // Filter mood data by date range
          if (reportMoodData) {
            const startDate = new Date(reportStartDate);
            const endDate = new Date(reportEndDate);
            
            reportMoodData.recentMoods = reportMoodData.recentMoods.filter(mood => {
              const moodDate = new Date(mood.local_date);
              return moodDate >= startDate && moodDate <= endDate;
            });
            
            reportMoodData.moodTrends = reportMoodData.moodTrends.filter(mood => {
              const moodDate = new Date(mood.local_date);
              return moodDate >= startDate && moodDate <= endDate;
            });
            
            // Recalculate distribution for the date range
            reportMoodData.moodDistribution = reportMoodData.recentMoods.reduce((acc, mood) => {
              acc[mood.mood] = (acc[mood.mood] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            
            reportMoodData.totalEntries = reportMoodData.recentMoods.length;
          }
        } catch (err) {
          console.log('Could not fetch mood data for report:', err);
          // Continue with report generation without mood data
        }
      }
      
      if (!phq9Data && clientId) {
        try {
          reportPHQ9Data = await getClientPHQ9Analysis(clientId);
          // Filter PHQ-9 data by date range
          if (reportPHQ9Data) {
            const startDate = new Date(reportStartDate);
            const endDate = new Date(reportEndDate);
            
            reportPHQ9Data.recentEntries = reportPHQ9Data.recentEntries.filter(entry => {
              const entryDate = new Date(entry.completedAt);
              return entryDate >= startDate && entryDate <= endDate;
            });
            
            // Recalculate distribution for the date range
            reportPHQ9Data.severityDistribution = reportPHQ9Data.recentEntries.reduce((acc, entry) => {
              acc[entry.severity] = (acc[entry.severity] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            
            reportPHQ9Data.totalEntries = reportPHQ9Data.recentEntries.length;
            
            // Recalculate average for the date range
            if (reportPHQ9Data.recentEntries.length > 0) {
              const totalScore = reportPHQ9Data.recentEntries.reduce((sum, entry) => sum + entry.totalScore, 0);
              reportPHQ9Data.averageScore = Math.round((totalScore / reportPHQ9Data.recentEntries.length) * 10) / 10;
            }
          }
        } catch (err) {
          console.log('Could not fetch PHQ-9 data for report:', err);
          // Continue with report generation without PHQ-9 data
        }
      }
      
      // Simulate additional processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate and download report
      const clientName = currentClient?.anonymous 
        ? (currentClient?.nickname || 'Anonymous Client')
        : (currentClient?.name || 'Client');
      
      generateMockPDF(clientName, reportStartDate, reportEndDate, reportSessions, reportMoodData, reportPHQ9Data);
      
      // Show success message
      showFlashMessage('success', 'Report generated and downloaded successfully!');
      
      // Close modal
      setIsReportModalOpen(false);
      setReportStartDate('');
      setReportEndDate('');
    } catch (error) {
      console.error('Error generating report:', error);
      showFlashMessage('error', 'Failed to generate report. Please try again.');
    } finally {
      setReportGenerating(false);
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
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Earnings</p>
              <p className="text-2xl font-semibold text-green-600">Rs {currentClient.earnings?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            From {currentClient.sessionCount} sessions
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
            className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors"
            onClick={handleOpenReportModal}
          >
            <FileDown className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-sm text-gray-800">Generate Report</span>
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
          
          {isAddingConcern ? (
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2">
              <input
                type="text"
                value={newConcernText}
                onChange={(e) => setNewConcernText(e.target.value)}
                placeholder="Enter new concern..."
                className="border-none outline-none bg-transparent flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveConcern();
                  } else if (e.key === 'Escape') {
                    handleCancelAddConcern();
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleSaveConcern}
                className="text-green-600 hover:text-green-800 p-1"
                title="Save concern"
              >
                ✓
              </button>
              <button
                onClick={handleCancelAddConcern}
                className="text-red-600 hover:text-red-800 p-1"
                title="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddConcern}
              className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg border border-dashed border-gray-300 flex items-center"
            >
              <span className="text-lg mr-1">+</span>
              <span>Add Concern</span>
            </button>
          )}
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
            onClick={() => window.location.href = '/calendar'}
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
                  Fee
                </th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topics
                </th> */}
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th> */}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions
                .sort((a, b) => {
                  // Parse the formatted date string (e.g., "July 25, 2025 • 12:00 PM")
                  const parseDateString = (dateStr: string) => {
                    const [datePart, timePart] = dateStr.split(' • ');
                    if (!datePart || !timePart) return new Date(0);
                    
                    // Convert "July 25, 2025 • 12:00 PM" to "July 25, 2025 12:00 PM"
                    const fullDateStr = `${datePart} ${timePart}`;
                    return new Date(fullDateStr);
                  };
                  
                  const dateA = parseDateString(a.date);
                  const dateB = parseDateString(b.date);
                  return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
                })
                .map((session) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">Rs {session.price?.toFixed(2) || '0.00'}</div>
                  </td>
                  {/* <td className="px-6 py-4">
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
                  </td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap">
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
                  </td> */}
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

  // const renderDetailsTab = () => {
  //   if (!currentClient) return null;

  const renderMoodTab = () => {
    if (!currentClient) return null;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-indigo-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mental Health Analytics</h3>
                <p className="text-sm text-gray-600">Comprehensive mood and depression assessment tracking</p>
              </div>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6 pb-4">
              <button 
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  moodSubTab === 'phq9' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMoodSubTab('phq9')}
              >
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  PHQ-9 Depression Assessment
                </div>
              </button>
              <button 
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  moodSubTab === 'mood' 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMoodSubTab('mood')}
              >
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Daily Mood Tracking
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* PHQ-9 Content */}
        {moodSubTab === 'phq9' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">PHQ-9 Depression Assessment</h4>
                  <p className="text-sm text-gray-600">Clinical depression screening and severity tracking</p>
                </div>
              </div>
              <button
                onClick={fetchPHQ9Analysis}
                disabled={phq9Loading}
                className="flex items-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {phq9Loading ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>

            {phq9Error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <X className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{phq9Error}</p>
                </div>
              </div>
            )}

            {phq9Loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className="ml-3 text-gray-600">Loading PHQ-9 analysis...</span>
              </div>
            )}

            {!phq9Loading && !phq9Error && phq9Data && (
              <>
                {/* PHQ-9 Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">Total Assessments</p>
                        <p className="text-2xl font-bold text-red-900">{phq9Data.totalEntries}</p>
                      </div>
                      <FileText className="w-8 h-8 text-red-500" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-600">Average Score</p>
                        <p className="text-2xl font-bold text-amber-900">{phq9Data.averageScore}/27</p>
                      </div>
                      <BarChart2 className="w-8 h-8 text-amber-500" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Current Severity</p>
                        <p className="text-lg font-bold text-blue-900">{phq9Data.currentSeverity || 'N/A'}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>

                  <div className={`bg-gradient-to-r p-4 rounded-lg border ${
                    phq9Data.hasRiskIndicators 
                      ? 'from-red-50 to-red-100 border-red-200' 
                      : 'from-green-50 to-green-100 border-green-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          phq9Data.hasRiskIndicators ? 'text-red-600' : 'text-green-600'
                        }`}>Risk Status</p>
                        <p className={`text-sm font-bold ${
                          phq9Data.hasRiskIndicators ? 'text-red-900' : 'text-green-900'
                        }`}>
                          {phq9Data.hasRiskIndicators ? 'Attention Needed' : 'Stable'}
                        </p>
                      </div>
                      <Flag className={`w-8 h-8 ${
                        phq9Data.hasRiskIndicators ? 'text-red-500' : 'text-green-500'
                      }`} />
                    </div>
                  </div>
                </div>

                {/* PHQ-9 Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2">
                    <PHQ9Chart
                      phq9Data={phq9Data}
                      type="line"
                      className="h-full"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <PHQ9Chart
                      phq9Data={phq9Data}
                      type="severity-distribution"
                      className="h-full"
                    />
                  </div>
                </div>

                {/* Score Distribution Bar Chart */}
                <div className="mb-6">
                  <PHQ9Chart
                    phq9Data={phq9Data}
                    type="score-comparison"
                    className="w-full"
                  />
                </div>
              </>
            )}

            {!phq9Loading && !phq9Error && !phq9Data && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No PHQ-9 Data Available</h4>
                <p className="text-gray-600 mb-4">
                  This client hasn't completed any PHQ-9 assessments yet.
                </p>
                <button
                  onClick={fetchPHQ9Analysis}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Try Loading Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Daily Mood Tracking Content */}
        {moodSubTab === 'mood' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Brain className="w-6 h-6 text-indigo-600 mr-3" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Daily Mood Tracking</h4>
                  <p className="text-sm text-gray-600">Track and analyze daily mood patterns over time</p>
                </div>
              </div>
              <button
                onClick={fetchMoodAnalysis}
                disabled={moodLoading}
                className="flex items-center px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {moodLoading ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>

            {/* Month Navigation Controls */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showAllTime"
                      checked={showAllTime}
                      onChange={(e) => setShowAllTime(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="showAllTime" className="ml-2 text-sm font-medium text-gray-700">
                      Show All Time Data
                    </label>
                  </div>
                  
                  {!showAllTime && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const newDate = new Date(selectedYear, selectedMonth - 1);
                          setSelectedMonth(newDate.getMonth());
                          setSelectedYear(newDate.getFullYear());
                        }}
                        className="p-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
                        title="Previous Month"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>
                              {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                          ))}
                        </select>
                        
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        >
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      
                      <button
                        onClick={() => {
                          const newDate = new Date(selectedYear, selectedMonth + 1);
                          setSelectedMonth(newDate.getMonth());
                          setSelectedYear(newDate.getFullYear());
                        }}
                        className="p-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition-colors"
                        title="Next Month"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                {!showAllTime && (
                  <div className="text-sm text-gray-600">
                    Showing data for: <span className="font-medium">
                      {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {moodError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <X className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{moodError}</p>
                </div>
              </div>
            )}

            {moodLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading mood analysis...</span>
              </div>
            )}

            {!moodLoading && !moodError && moodData && (
              <>
                {/* Mood Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Entries</p>
                        <p className="text-2xl font-bold text-blue-900">{moodData.totalEntries}</p>
                      </div>
                      <BarChart2 className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Average Score</p>
                        <p className="text-2xl font-bold text-green-900">{moodData.averageMoodScore}/5</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Recent Entries</p>
                        <p className="text-2xl font-bold text-purple-900">{moodData.recentMoods.length}</p>
                        <p className="text-xs text-purple-500">(Last 30 days)</p>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-600">Last Updated</p>
                        <p className="text-sm font-bold text-amber-900">
                          {moodData.lastUpdated 
                            ? new Date(moodData.lastUpdated).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })
                            : 'No data'
                          }
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-amber-500" />
                    </div>
                  </div>
                </div>

                {/* Mood Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="lg:col-span-1">
                    <MoodChart
                      moodData={moodData}
                      type="line"
                      className="h-full"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <MoodChart
                      moodData={moodData}
                      type="distribution"
                      className="h-full"
                    />
                  </div>
                </div>

                {/* Recent Mood Entries Table */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Mood Entries</h4>
                  
                  {moodData.recentMoods.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Date</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Mood</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {moodData.recentMoods
                            .sort((a, b) => new Date(b.local_date).getTime() - new Date(a.local_date).getTime())
                            .slice(0, 10)
                            .map((mood, index) => {
                            const moodLabels: Record<string, string> = {
                              'Sad': 'Sad',
                              'Anxious': 'Anxious',
                              'Unpleasant': 'Unpleasant',
                              'Neutral': 'Neutral',
                              'Alert': 'Alert',
                              'Calm': 'Calm',
                              'Pleasant': 'Pleasant',
                              'Content': 'Content',
                              'Happy': 'Happy',
                              'Excited': 'Excited'
                            };
                            
                            const moodColors: Record<string, string> = {
                              'Sad': 'text-red-600 bg-red-100',
                              'Anxious': 'text-orange-600 bg-orange-100',
                              'Unpleasant': 'text-orange-600 bg-orange-100',
                              'Neutral': 'text-gray-600 bg-gray-100',
                              'Alert': 'text-blue-600 bg-blue-100',
                              'Calm': 'text-cyan-600 bg-cyan-100',
                              'Pleasant': 'text-green-600 bg-green-100',
                              'Content': 'text-green-600 bg-green-100',
                              'Happy': 'text-emerald-600 bg-emerald-100',
                              'Excited': 'text-red-600 bg-red-100'
                            };
                            
                            const moodScores: Record<string, number> = {
                              'Sad': 1,
                              'Anxious': 2,
                              'Unpleasant': 2,
                              'Neutral': 3,
                              'Alert': 3,
                              'Calm': 4,
                              'Pleasant': 4,
                              'Content': 4,
                              'Happy': 5,
                              'Excited': 5
                            };

                            return (
                              <tr key={index} className="border-b border-gray-200 hover:bg-white">
                                <td className="py-3 px-3">
                                  {new Date(mood.local_date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </td>
                                <td className="py-3 px-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${moodColors[mood.mood] || 'text-gray-600 bg-gray-100'}`}>
                                    {moodLabels[mood.mood] || mood.mood}
                                  </span>
                                </td>
                                <td className="py-3 px-3 font-medium">
                                  {moodScores[mood.mood] || 3}/5
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recent mood entries found</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {!moodLoading && !moodError && !moodData && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Mood Data Available</h4>
                <p className="text-gray-600 mb-4">
                  This client hasn't logged any mood entries yet, or the data is not accessible.
                </p>
                <button
                  onClick={fetchMoodAnalysis}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Try Loading Again
                </button>
              </div>
            )}
          </div>
        )}
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
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                      ID: {currentClient.id}
                    </span>
                    {currentClient.anonymous && (
                      <span className="px-2 py-0.5 rounded-full bg-primary bg-opacity-10 text-primary text-xs font-medium">
                        Anonymous
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">
                      Client since: <span className="font-medium">{currentClient.joinDate}</span>
                    </span>
                    {currentClient.student && (
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 bg-primary bg-opacity-10 text-primary text-xs rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                          </svg>
                          Student
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Report Generation Button */}
              <div className="ml-auto">
                <button
                  onClick={handleOpenReportModal}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Generate Report
                </button>
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
                  className={`pb-2 text-sm font-medium -mb-px ${activeTab === 'mood' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('mood')}
                >
                  Mood Analysis
                </button>
                {/* <button 
                  className={`pb-2 text-sm font-medium -mb-px ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('details')}
                >
                  Client Details
                </button> */}
              </nav>
            </div>
          </div>
          )}
          
          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'notes' && renderNotesTab()}
            {activeTab === 'sessions' && renderSessionsTab()}
            {activeTab === 'mood' && renderMoodTab()}
            {/* {activeTab === 'details' && renderDetailsTab()} */}
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
                    
                    {selectedSession.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Session Notes</h4>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700">
                          {selectedSession.notes}
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

          {/* Report Generation Modal */}
          {isReportModalOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-6"
              onClick={(e) => {
                if (e.target === e.currentTarget && !reportGenerating) {
                  setIsReportModalOpen(false);
                }
              }}
            >
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FileDown className="w-6 h-6 mr-2 text-indigo-600" />
                      Generate Client Report
                    </h3>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => setIsReportModalOpen(false)}
                      disabled={reportGenerating}
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-700 text-sm">
                      Generate a comprehensive report for {currentClient?.anonymous 
                        ? (currentClient?.nickname || 'this client') 
                        : currentClient?.name
                      } covering sessions, notes, and progress within the selected date range.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={reportStartDate}
                          onChange={(e) => setReportStartDate(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          max={reportEndDate || new Date().toISOString().split('T')[0]}
                          disabled={reportGenerating}
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          End Date
                        </label>
                        <input
                          type="date"
                          value={reportEndDate}
                          onChange={(e) => setReportEndDate(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min={reportStartDate}
                          max={new Date().toISOString().split('T')[0]}
                          disabled={reportGenerating}
                        />
                      </div>
                    </div>

                    {reportStartDate && reportEndDate && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-indigo-800 mb-2">Report will include:</h4>
                        <ul className="text-sm text-indigo-700 space-y-1">
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                            Session summaries and attendance
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                            Progress notes and observations
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                            Session ratings and feedback
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                            Treatment goals and outcomes
                          </li>
                        </ul>
                        <p className="text-xs text-indigo-600 mt-3">
                          Period: {new Date(reportStartDate).toLocaleDateString()} to {new Date(reportEndDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-4">
                    <button
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                      onClick={() => setIsReportModalOpen(false)}
                      disabled={reportGenerating}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center"
                      onClick={handleGenerateReport}
                      disabled={!reportStartDate || !reportEndDate || reportGenerating}
                    >
                      {reportGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileDown className="w-4 h-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flash Message */}
          <FlashMessage
            type={flashMessage.type}
            message={flashMessage.message}
            isVisible={flashMessage.isVisible}
            onClose={hideFlashMessage}
          />
          </div>  
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
