/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { makeRequest } from '../../api/apiBase'; // Your API helper
// Import the TYPE and FUNCTION
import { ClientNote, getClientDetails, createClientNote } from '../../api/counsellorAPI';

// Declare JitsiMeetExternalAPI on the Window interface for TypeScript
declare global {
    interface Window {
        JitsiMeetExternalAPI?: any;
    }
}

type Note = ClientNote;

const MeetingPage: React.FC = () => {
    const { sessionId, clientId } = useParams<{ sessionId: string, clientId: string }>();
    const navigate = useNavigate();
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const [jitsiApi, setJitsiApi] = useState<any>(null);
    const [meetingLoading, setMeetingLoading] = useState(true);
    const [meetingError, setMeetingError] = useState<string | null>(null);
    const [notes, setNotes] = useState<Note[]>([]); // Initialize empty
    const [loadingNotes, setLoadingNotes] = useState(true); // Start true

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [isNewNotePrivate, setIsNewNotePrivate] = useState(false);
    const [creatingNote, setCreatingNote] = useState(false);

    // Initialize Jitsi function (Keep as is)
    const initializeJitsi = useCallback((domain: string, roomName: string, jwt: string) => {
        // ... (Your existing initializeJitsi code) ...
        // Ensure it calls setMeetingLoading(false) on success/failure paths
        if (window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
            try {
                const options = { /* ... */ roomName, jwt, width: '100%', height: '100%', parentNode: jitsiContainerRef.current, configOverwrite: { /* ... */ } };
                console.log('Initializing Jitsi...');
                const api = new window.JitsiMeetExternalAPI(domain, options);
                setJitsiApi(api);
                api.addEventListener('videoConferenceLeft', () => { console.log('Left meeting'); api?.dispose(); navigate(`/clients/${clientId}`); });
                api.addEventListener('readyToClose', () => { console.log('Ready to close'); api?.dispose(); navigate(`/clients/${clientId}`); });
                setMeetingLoading(false); // SUCCESS: Meeting is initializing
            } catch (initError: any) { console.error("Jitsi Init Error:", initError); setMeetingError(`Failed to initialize Jitsi: ${initError.message}`); setMeetingLoading(false); }
        } else { console.error("Jitsi API script not loaded or ref missing"); setMeetingError('Jitsi Meet API failed to load...'); setMeetingLoading(false); }
    }, [navigate, clientId]);


    // Handle Create Note (Keep as is)
    const handleCreateNote = async () => {
       if (!clientId || !newNoteContent.trim()) {
         alert('Please enter note content.');
         return;
       }

       console.log('Attempting to create note...', { content: newNoteContent, isPrivate: isNewNotePrivate });
       setCreatingNote(true);

       try {
         // createClientNote returns { success: true, data: { note object } }
         const response = await createClientNote(clientId, {
           content: newNoteContent.trim(),
           isPrivate: isNewNotePrivate
         });

         console.log('createClientNote API response:', JSON.stringify(response, null, 2));

         // Check the DIRECT data object and use camelCase properties from API
         if (response.success && response.data &&
             typeof response.data.id === 'number' &&
             typeof response.data.is_private === 'boolean' && // Check snake_case is_private
             response.data.created_at &&
             response.data.created_by &&
             typeof response.data.counselor_id === 'number'
         ) {

           const apiNoteData = response.data; // Get the note object directly

           // Format the date (keep this part)
           let formattedDate = 'Date unavailable';
           try {
             formattedDate = new Date(apiNoteData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
             if (formattedDate === 'Invalid Date') { throw new Error('Invalid Date'); }
           } catch (dateError) {
             console.error("Error formatting date:", dateError, apiNoteData.created_at);
             formattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
           }

          
           const newNoteToAdd: Note = {
               id: apiNoteData.id,
               content: apiNoteData.content,
               created_at: formattedDate, // Map API createdAt to interface created_at (formatted)
               created_by: apiNoteData.created_by, // Map API created_by to interface created_by
               is_private: apiNoteData.is_private, // Map API is_private to interface is_private
               is_deleted: false, // Assuming default
               counselor_id: apiNoteData.counselor_id // Map API counselor_id to interface counselor_id
           };
           
           console.log('Final object being added to state:', JSON.stringify(newNoteToAdd, null, 2));
           console.log('Value of is_private being added to state:', newNoteToAdd.is_private);


           // Add the correctly mapped note to the state
           setNotes(prevNotes =>
             [newNoteToAdd, ...prevNotes]
             .sort((a) => {
                  // Use original date string from API for reliable sorting if possible, otherwise parse formatted
                 try {
                     // Compare original ISO strings if available, else parse formatted
                     const dateB = apiNoteData.created_at; // Use original for sorting the new item
                     // Fallback to parsing formatted string if original isn't easily accessible
                     return new Date(dateB).getTime() - new Date(a.created_at).getTime();
                 } catch { return 0;}
              })
           );

           // Reset form
           setNewNoteContent('');
           setIsNewNotePrivate(false);
           setShowCreateForm(false);

           console.log('Note created successfully.');

         } else {
           // Log why validation failed
           console.error('Validation failed based on response structure:', response);
           alert('Failed to create note. Please try again.');
         }
       } catch (error: any) {
         console.error('Error caught during createClientNote call:', error);
         alert(`An error occurred: ${error.message || 'Please try again.'}`);
       } finally {
         setCreatingNote(false);
       }
    };

    // Add this useEffect to monitor the notes state directly
    useEffect(() => {
      console.log("Notes state updated:", JSON.stringify(notes, null, 2));
    }, [notes]);


    // Main data fetching effect
    useEffect(() => {
        console.log('useEffect triggered - sessionId:', sessionId, 'clientId:', clientId);
        let isMounted = true;

        // --- Dynamic Jitsi Script Loader (Keep as is) ---
        const loadJitsiScript = () => { /* ... returns Promise ... */
            return new Promise<void>((resolve, reject) => { /* ... script loading logic ... */
                 if (window.JitsiMeetExternalAPI) { resolve(); return; }
                 const script = document.createElement('script');
                 script.src = 'https://meet.sona.org.lk/external_api.js'; script.async = true;
                 script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed to load video meeting service.'));
                 document.head.appendChild(script);
                 return () => {
                    const existingScript = document.querySelector(`script[src="${script.src}"]`);
                    if(existingScript && document.head.contains(existingScript)) { document.head.removeChild(existingScript); }
                }
            });
        };
        // --- End Script Loader ---

        const fetchData = async () => {
            if (!sessionId || !clientId) {
                if (isMounted) {
                    setMeetingError('Missing session or client ID.');
                    setMeetingLoading(false); setLoadingNotes(false);
                }
                return;
            }

            // Reset states at the start
            if (isMounted) {
                setMeetingLoading(true);
                setLoadingNotes(true);
                setMeetingError(null);
                setNotes([]); // Reset notes state *before* fetching
                console.log("States reset for fetching.");
            }

            let fetchedNotes: Note[] = []; // Temporary variable for notes

            try {
                // --- 1. Fetch Client Details ---
                console.log(`Fetching client details for client ID: ${clientId}.`);
                try {
                    // Assuming getClientDetails handles auth internally
                    const clientDetailsResponse = await getClientDetails(clientId);
                    console.log('Client details response:', clientDetailsResponse);

                    if (isMounted && clientDetailsResponse.success && clientDetailsResponse.data) {
                        const clientData = clientDetailsResponse.data;
                        const currentCounsellorId = parseInt(localStorage.getItem('counsellor_id') || '0');
                        fetchedNotes = clientData.notes.filter(note => // Store in temp variable
                            !note.is_deleted && (!note.is_private || note.counselor_id === currentCounsellorId)
                        );
                        console.log(`Successfully fetched ${fetchedNotes.length} filtered notes.`);
                    } else if (isMounted) {
                        console.warn('Failed to fetch client details or data missing. Notes will be empty.');
                        fetchedNotes = []; // Ensure it's empty on failure
                    }
                } catch (clientError) {
                    // Catch errors specifically from getClientDetails
                    console.error('Error fetching client details:', clientError);
                    if (isMounted) {
                        // Display a non-blocking warning, maybe?
                         console.warn('Could not load client notes due to an error.');
                        fetchedNotes = []; // Ensure notes are empty on error
                    }
                } finally {
                     // Set notes state *after* the try/catch for client details
                    if (isMounted) {
                        console.log("Setting notes state now with fetchedNotes:", fetchedNotes);
                        setNotes(fetchedNotes);
                        setLoadingNotes(false); // Notes loading finished (success or fail)
                        console.log("Finished setting notes and loading state.");
                    }
                }

                // --- 2. Fetch the Jitsi Session Link (Continue even if notes failed) ---
                console.log(`Fetching session link for session ID: ${sessionId}.`);
                const linkResponse = await makeRequest<{ success: boolean; data: { sessionLink: string } }>(
                    `sessions/getSessionLink/${sessionId}`,
                    'GET',
                    null
                );
                console.log('Session link response:', linkResponse);

                if (!isMounted) return;

                if (!linkResponse.success || !linkResponse.data?.sessionLink) {
                    throw new Error('Failed to get session link or link is missing.');
                }
                const sessionLink = linkResponse.data.sessionLink;

                // --- Parse link and initialize Jitsi ---
                const url = new URL(sessionLink);
                const domain = url.hostname;
                const roomName = url.pathname.substring(1);
                const jwt = url.searchParams.get('jwt');
                if (!domain || !roomName) {
                    throw new Error('Could not parse domain or room name from session link.');
                }
                initializeJitsi(domain, roomName, jwt || ''); // This sets meetingLoading false

            } catch (err: any) { // Catch errors from session link fetch or Jitsi init
                console.error('Error during session link fetch or Jitsi initialization:', err);
                if (isMounted) {
                    setMeetingError(err.message || 'Failed to load meeting.');
                    setMeetingLoading(false); // Ensure meeting loading stops
                    // Notes loading state should already be false from the finally block above
                }
            }
        };

        loadJitsiScript()
            .then(fetchData)
            .catch(scriptError => {
                if (isMounted) {
                    setMeetingError(scriptError.message);
                    setMeetingLoading(false);
                    setLoadingNotes(false);
                }
            });


        // Cleanup function
        return () => {
            isMounted = false;
            console.log('MeetingPage unmounting - disposing Jitsi API if exists');
            // Ensure API disposal happens correctly
            if (jitsiApi) {
                 try {
                     jitsiApi.dispose();
                 } catch (e) {
                     console.error("Error disposing Jitsi API:", e);
                 }
                setJitsiApi(null); // Clear API state
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, clientId, navigate, initializeJitsi]); // Keep deps

    // --- Helper to format date ---
    const formatDate = (dateString: string): string => { /* ... */
        try { return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch { return dateString; }
    };

    console.log('Rendering MeetingPage - Notes Count:', notes.length, 'Loading Notes:', loadingNotes, 'Meeting Loading:', meetingLoading);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Jitsi Area */}
            <div className="w-2/3 h-full bg-black relative flex-shrink-0">
                {meetingLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-75 z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-3"></div>
                        Loading Meeting...
                    </div>
                )}
                {meetingError && !meetingLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-100 bg-red-900 bg-opacity-95 z-10 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-semibold mb-2 text-lg">Error Loading Meeting</p>
                        <p className="text-sm text-center mb-4 text-red-200">{meetingError}</p>
                        <button onClick={() => navigate(`/clients/${clientId}`)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors">
                            Go Back
                        </button>
                    </div>
                )}
                {!meetingError && <div ref={jitsiContainerRef} className="absolute inset-0" />}
            </div>

            {/* Notes Area */}
            <div className="w-1/3 h-full p-4 overflow-y-auto bg-white border-l border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">Client Notes</h2>
                    <button onClick={() => setShowCreateForm(!showCreateForm)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                        {showCreateForm ? 'Cancel' : '+ Add Note'}
                    </button>
                </div>

                {/* Create Note Form */}
                {showCreateForm && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded flex-shrink-0">
                        {/* ... Create Note Form JSX ... */}
                         <textarea value={newNoteContent} onChange={(e) => setNewNoteContent(e.target.value)} placeholder="Enter your note..." className="w-full p-2 border border-gray-300 rounded text-sm resize-none" rows={3}/>
                         <div className="flex items-center justify-between mt-2">
                             <label className="flex items-center text-sm text-gray-600"> <input type="checkbox" checked={isNewNotePrivate} onChange={(e) => setIsNewNotePrivate(e.target.checked)} className="mr-2"/> Private Note </label>
                             <div className="flex gap-2">
                                 <button onClick={() => setShowCreateForm(false)} className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"> Cancel </button>
                                 <button onClick={handleCreateNote} disabled={creatingNote || !newNoteContent.trim()} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"> {creatingNote ? 'Creating...' : 'Save Note'} </button>
                             </div>
                         </div>
                    </div>
                )}

                {/* Notes List Area */}
                <div className="flex-grow overflow-y-auto pr-2">
                    {loadingNotes ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400 mr-2"></div>
                            <span className="text-sm text-gray-500">Loading notes...</span>
                        </div>
                    ) : notes.length > 0 ? (
                        [...notes]
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map(note => (
                                <div key={note.id} className="mb-3 p-3 bg-gray-50 rounded border border-gray-200 shadow-sm">
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-gray-500">{note.created_by} - {formatDate(note.created_at)}</p>
                                        {note.is_private && (<span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">Private</span>)}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className="text-sm text-gray-500 italic text-center mt-4">No notes available for this client.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeetingPage;