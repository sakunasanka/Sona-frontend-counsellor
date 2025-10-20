/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { makeRequest } from '../../api/apiBase'; // Your API helper
import { ClientNote, getClientDetails, createClientNote } from '../../api/counsellorAPI';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';

// Declare Jitsi Meet External API for TypeScript
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

// ... (Keep Jitsi script comment, declare global, Note type)
type Note = ClientNote;

const MeetingPage: React.FC = () => {
    const { sessionId, clientId } = useParams<{ sessionId: string, clientId: string }>();
    const navigate = useNavigate();
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const [jitsiApi, setJitsiApi] = useState<any>(null);
    const [meetingLoading, setMeetingLoading] = useState(true);
    const [meetingError, setMeetingError] = useState<string | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [isNewNotePrivate, setIsNewNotePrivate] = useState(false);
    const [creatingNote, setCreatingNote] = useState(false);

    // --- State for Notes Visibility ---
    const [showNotes, setShowNotes] = useState(false); // Default to hidden
    // --- End State ---


    // Initialize Jitsi function (Keep as is)
    const initializeJitsi = useCallback((domain: string, roomName: string, jwt: string) => {
        // ... (Your existing initializeJitsi code) ...
        if (window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
            try {
                const options = { /* ... */ roomName, jwt, width: '100%', height: '100%', parentNode: jitsiContainerRef.current, configOverwrite: { /* ... */ } };
                console.log('Initializing Jitsi...');
                const api = new window.JitsiMeetExternalAPI(domain, options);
                setJitsiApi(api);
                api.addEventListener('videoConferenceLeft', () => { console.log('Left meeting'); api?.dispose(); navigate(`/clients/${clientId}`); });
                api.addEventListener('readyToClose', () => { console.log('Ready to close'); api?.dispose(); navigate(`/clients/${clientId}`); });
                setMeetingLoading(false);
            } catch (initError: any) { console.error("Jitsi Init Error:", initError); setMeetingError(`Failed to initialize Jitsi: ${initError.message}`); setMeetingLoading(false); }
        } else { console.error("Jitsi API script not loaded or ref missing"); setMeetingError('Jitsi Meet API failed to load...'); setMeetingLoading(false); }
    }, [navigate, clientId]);


    // Handle Create Note
  const handleCreateNote = async () => {
     if (!clientId || !newNoteContent.trim()) {
       alert('Please enter note content.');
       return;
     }

     console.log('Attempting to create note...');
     setCreatingNote(true);

     try {
       // Assume createClientNote returns the full structure logged
       const response = await createClientNote(clientId, {
         content: newNoteContent.trim(),
         isPrivate: isNewNotePrivate
       });

       console.log('createClientNote API response in handleCreateNote:', JSON.stringify(response, null, 2)); // Log full structure

       // --- FIX: Adjust check and mapping ---
       // 1. Check the nested 'data' object and its properties using API's camelCase
       if (response.success && response.data &&
           typeof response.data.id === 'number' &&
           response.data.created_at && // Check existence
           response.data.created_by && // Check existence
           typeof response.data.counselor_id === 'number' // Check camelCase from API
       ) {

         const apiNoteData = response.data; // Get the actual note object from API response

         // 2. Keep the original date for sorting and create formatted version for display
         console.log('Original API date:', apiNoteData.created_at);

         // 3. Create the new note object mapping API (snake_case) to Note interface
         const newNoteToAdd: Note = {
             id: apiNoteData.id,
             content: apiNoteData.content,
             created_at: apiNoteData.created_at, // Keep original ISO date string for sorting
             created_by: apiNoteData.created_by,
             is_private: apiNoteData.is_private,
             is_deleted: false, // Assume default
             counselor_id: apiNoteData.counselor_id
         };
         // --- END FIX ---

         console.log('Successfully validated API response. Adding note to state:', newNoteToAdd);

         // Add the correctly mapped note to the state
         setNotes(prevNotes =>
           [newNoteToAdd, ...prevNotes]
           .sort((a, b) => {
               // Use original ISO date string for reliable sorting
               try {
                   const dateA = new Date(a.created_at).getTime();
                   const dateB = new Date(b.created_at).getTime();
                   return dateB - dateA; // Newest first
               } catch (error) {
                   console.warn('Error sorting notes by date:', error);
                   return 0; // Fallback if dates are unparseable
               }
           })
         );

         // Reset form
         setNewNoteContent('');
         setIsNewNotePrivate(false);
         setShowCreateForm(false);

         console.log('Note created successfully.');

       } else {
         // Log why the validation failed
         console.error('Validation failed. Response success:', response.success);
         console.error('Nested data exists:', !!response.data);
         if(response.data) {
             console.error('ID type:', typeof response.data.id);
             console.error('is_private type:', typeof response.data.is_private);
             console.error('created_at exists:', !!response.data.created_at);
             console.error('created_by exists:', !!response.data.created_by);
             console.error('counselor_id type:', typeof response.data.counselor_id);
         }

         console.error('Failed to create note - API response structure mismatch or failure:', response);
         const apiMessage = response.message || 'Please try again.';
         alert(`Failed to create note. ${apiMessage}`);
       }
     } catch (error: any) {
       console.error('Error caught during createClientNote call:', error);
       alert(`An error occurred: ${error.message || 'Please try again.'}`);
     } finally {
       setCreatingNote(false);
     }
  };

    // Main data fetching effect (Keep as is)
    useEffect(() => {
        console.log('[EFFECT START] Triggered - sessionId:', sessionId, 'clientId:', clientId);
        let isMounted = true;
        let scriptCleanup: (() => void) | null = null;

        // --- Dynamic Jitsi Script Loader ---
        const loadJitsiScript = () => {
            return new Promise<void>((resolve, reject) => {
                if (window.JitsiMeetExternalAPI) {
                    console.log('[ScriptLoader] Jitsi API already exists.');
                    resolve(); return;
                }
                const scriptId = 'jitsi-external-api-script';
                const existingScript = document.getElementById(scriptId);
                if (existingScript) {
                    console.log('[ScriptLoader] Script tag exists, waiting for API...');
                    let attempts = 0; const intervalId = setInterval(() => {
                        if (window.JitsiMeetExternalAPI) { clearInterval(intervalId); console.log('[ScriptLoader] API became available.'); resolve(); }
                        else if (attempts++ > 50) { clearInterval(intervalId); console.error('[ScriptLoader] Timeout waiting for API.'); reject(new Error('Timeout initializing video service.')); }
                    }, 100); return;
                }
                console.log('[ScriptLoader] Creating script tag...');
                const script = document.createElement('script');
                script.id = scriptId; script.src = 'https://meet.sona.org.lk/external_api.js'; script.async = true;
                script.onload = () => { console.log('[ScriptLoader] Script loaded via onload.'); resolve(); };
                script.onerror = (error) => { console.error('[ScriptLoader] Script load error:', error); reject(new Error('Failed to load video service script.')); };
                document.head.appendChild(script);
                scriptCleanup = () => { /* ... remove script tag ... */ };
            });
        };
        // --- End Script Loader ---

        const fetchData = async () => {
            console.log("[fetchData] Starting..."); // <-- ADD THIS LOG
            if (!sessionId || !clientId) {
                console.error("[fetchData] Aborting: Missing sessionId or clientId."); // <-- ADD THIS LOG
                if (isMounted) { setMeetingError('Missing session or client ID.'); setMeetingLoading(false); setLoadingNotes(false); }
                return;
            }

            const authToken = localStorage.getItem('auth_token'); // Assuming needed, though removed from calls later
            if (!authToken) { // Keep this check as good practice
                console.error("[fetchData] Aborting: Missing auth token."); // <-- ADD THIS LOG
                if (isMounted) { setMeetingError('Authentication required.'); setMeetingLoading(false); setLoadingNotes(false); }
                return; // Or navigate('/login');
            }

            // Reset states only when starting the fetch
            if (isMounted) {
                setMeetingLoading(true); setLoadingNotes(true); setMeetingError(null); setNotes([]);
                console.log("[fetchData] States reset.");
            }

            let fetchedNotes: Note[] = [];

            try {
                // --- 1. Fetch Client Details ---
                console.log(`[fetchData] Attempting to fetch client details for ID: ${clientId}.`); // <-- ADD THIS LOG
                const clientDetailsPromise = getClientDetails(clientId); // No token passed as requested

                // --- 2. Fetch Session Link ---
                console.log(`[fetchData] Attempting to fetch session link for ID: ${sessionId}.`); // <-- ADD THIS LOG
                const linkPromise = makeRequest<{ success: boolean; data: { sessionLink: string } }>(
                    `sessions/getSessionLink/${sessionId}`, 'GET', null // No token passed as requested
                );

                // Await both promises
                const [clientDetailsResponse, linkResponse] = await Promise.all([
                    clientDetailsPromise, linkPromise
                ]);
                console.log('[fetchData] Client details response received:', clientDetailsResponse);
                console.log('[fetchData] Session link response received:', linkResponse);

                if (!isMounted) return;

                // Process Notes
                if (clientDetailsResponse.success && clientDetailsResponse.data) {
                    // ... (filtering logic - keep as is) ...
                    const clientData = clientDetailsResponse.data;
                    const currentCounsellorId = parseInt(localStorage.getItem('counsellor_id') || '0');
                    fetchedNotes = clientData.notes.filter(note => !note.is_deleted && (!note.is_private || note.counselor_id === currentCounsellorId));
                    console.log(`[fetchData] Setting ${fetchedNotes.length} notes.`);
                    setNotes(fetchedNotes);
                } else {
                    console.warn('[fetchData] Client details fetch failed. Notes empty.');
                    setNotes([]);
                }
                setLoadingNotes(false);

                // Process Link & Init Jitsi
                if (!linkResponse.success || !linkResponse.data?.sessionLink) {
                    throw new Error('Failed to get session link or link is missing.');
                }
                const sessionLink = linkResponse.data.sessionLink;
                const url = new URL(sessionLink);
                const domain = url.hostname; const roomName = url.pathname.substring(1); const jwt = url.searchParams.get('jwt');
                if (!domain || !roomName) { throw new Error('Could not parse link.'); }
                console.log("[fetchData] Initializing Jitsi...");
                initializeJitsi(domain, roomName, jwt || ''); // Sets meetingLoading false

            } catch (err: any) {
                console.error('[fetchData] Error during fetch or initialization:', err);
                if (isMounted) { setMeetingError(err.message || 'Failed.'); setMeetingLoading(false); setLoadingNotes(false); setNotes([]); }
            }
        };

        console.log("[EFFECT] Attempting to load Jitsi script...");
        loadJitsiScript()
            .then(() => {
                console.log("[EFFECT] Script loaded or available, calling fetchData.");
                if (isMounted) { fetchData(); }
                else { console.log("[EFFECT] Component unmounted before fetchData could run."); }
            })
            .catch(scriptError => {
                console.error("[EFFECT] Error loading Jitsi script:", scriptError); // <-- Enhanced Log
                if (isMounted) {
                    setMeetingError(scriptError.message);
                    setMeetingLoading(false);
                    setLoadingNotes(false);
                }
            });


        // Cleanup function
        return () => {
            isMounted = false;
            console.log('[EFFECT CLEANUP] Unmounting - running cleanup');
            if (scriptCleanup) { scriptCleanup(); }
            if (jitsiApi) { /* ... dispose API ... */ setJitsiApi(null); }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, clientId]);


    // --- Helper to format date ---
    const formatDate = (dateString: string | undefined | null): string => {
        if (!dateString) {
            return 'Date unavailable';
        }
        
        try {
            const date = new Date(dateString);
            
            // Check if the date is valid
            if (isNaN(date.getTime())) {
                console.warn('Invalid date string:', dateString);
                return 'Invalid date';
            }
            
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Date formatting error:', error, 'for dateString:', dateString);
            return 'Date error';
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden relative"> {/* Added relative positioning */}

            {/* Jitsi Area - Adjust width based on showNotes state */}
            {/* Added transition-all for smooth width change */}
            <div className={`h-full bg-black relative flex-shrink-0 transition-all duration-300 ease-in-out ${showNotes ? 'w-2/3' : 'w-full'}`}>
                {/* --- Toggle Notes Button --- */}
                {/* Positioned absolutely within the Jitsi area container */}
                <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="absolute top-4 right-4 z-20 p-2 bg-gray-700 bg-opacity-60 hover:bg-opacity-80 rounded-full text-white transition-opacity"
                    title={showNotes ? "Hide Notes" : "Show Notes"}
                >
                    {showNotes ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
                </button>
                {/* --- End Toggle Button --- */}

                {meetingLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-75 z-10">
                        {/* ... Loading overlay ... */}
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-3"></div>
                        Loading Meeting...
                    </div>
                )}
                {meetingError && !meetingLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-100 bg-red-900 bg-opacity-95 z-10 p-4">
                        {/* ... Error overlay ... */}
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         <p className="font-semibold mb-2 text-lg">Error Loading Meeting</p>
                         <p className="text-sm text-center mb-4 text-red-200">{meetingError}</p>
                         <button onClick={() => navigate(`/clients/${clientId}`)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors"> Go Back </button>
                    </div>
                )}
                {!meetingError && <div ref={jitsiContainerRef} className="absolute inset-0" />}
            </div>

            {/* Notes Area - Conditionally render based on showNotes state */}
            {/* Added transition-all for smooth appearance */}
            <div className={`h-full p-4 overflow-y-auto bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${showNotes ? 'w-1/3' : 'w-0 p-0 border-l-0 overflow-hidden'}`}>
                {showNotes && ( // Only render content if shown
                    <>
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
                                    {/* ... Loading Notes indicator ... */}
                                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400 mr-2"></div>
                                     <span className="text-sm text-gray-500">Loading notes...</span>
                                </div>
                            ) : notes.length > 0 ? (
                                [...notes]
                                    .sort((a, b) => {
                                        // Sort by date - use original ISO date string
                                        try {
                                            const dateA = new Date((a as any).created_at || (a as any).created_at).getTime();
                                            const dateB = new Date((b as any).created_at || (b as any).created_at).getTime();
                                            
                                            // If dates are invalid, fall back to ID sorting
                                            if (isNaN(dateA) || isNaN(dateB)) {
                                                return (b as any).id - (a as any).id;
                                            }
                                            
                                            return dateB - dateA; // Newest first
                                        } catch (error) {
                                            console.warn('Error sorting notes:', error);
                                            return (b as any).id - (a as any).id; // Fallback to ID sorting
                                        }
                                    })
                                    .map(note => {
                                        // Debug log for first note
                                        if (note === notes[0]) {
                                            console.log('Sample note structure:', note);
                                        }
                                        return (
                                            <div key={note.id} className="mb-3 p-3 bg-gray-50 rounded border border-gray-200 shadow-sm">
                                                {/* ... Note content and details ... */}
                                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <p className="text-xs text-gray-500">{note.created_by} - {formatDate((note as any).created_at || (note as any).created_at)}</p>
                                                    {note.is_private && (<span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">Private</span>)}
                                                </div>
                                            </div>
                                        );
                                    })
                            ) : (
                                <p className="text-sm text-gray-500 italic text-center mt-4">No notes available for this client.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MeetingPage;