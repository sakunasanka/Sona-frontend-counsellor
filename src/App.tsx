import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ProfileProvider } from './contexts/ProfileContext';
import NotFoundPage from './pages/Error/NotFoundPage';
import ForbiddenPage from './pages/Error/ForbiddenPage';
import SignUp from "./pages/Auth/SignUp";
import SignIn from './pages/Auth/SignIn';
import GeneralUserSignIn from './pages/Auth/GeneralUserSignIn';
import CounsellorDashboard from './pages/Counsellor/CounsellorDashboard';
import ExampleUse from './pages/ExampleUse';
// import CounsellorFeedbacks from './pages/Counsellor/CounsellorFeedbacks';
import CounsellorSessions from './pages/Counsellor/CounsellorSessions';
import CounsellorSessionDetails from './pages/Counsellor/CounsellorSessionDetails';
import CounsellorBlogs from './pages/Counsellor/CounsellorBlogs';
import CreateBlog from './pages/Counsellor/CreateBlog';
import EditBlog from './pages/Counsellor/EditBlog';
import CounsellorChats from './pages/Counsellor/CounsellorChats';
import CounsellorProfile from './pages/Counsellor/CounsellorProfile';
import CounsellorCalendar from './pages/Counsellor/CounsellorCalendar';
import CounsellorClients from './pages/Counsellor/CounsellorClients';
import CounsellorEarnings from './pages/Counsellor/CounsellorEarnings';
import ClientDetails from './pages/Counsellor/ClientDetails';
import PsychiatristDashboard from './pages/Psychiatrist/PsychiatristDashboard';
import PsychiatristChat from './pages/Psychiatrist/PsychiatristChats';
import PsychiatristSessions from './pages/Psychiatrist/PsychiatristSessions';
import PsychiatristSessionDetails from './pages/Psychiatrist/PsychiatristSessionDetails';
import PsychiatristFeedbacks from './pages/Psychiatrist/PsychiatristFeedbacks';
import PsychiatristPatients from './pages/Psychiatrist/PsychiatristPatients';
import PatientDetails from './pages/Psychiatrist/PatientDetails';
import CreatePrescription from './pages/Psychiatrist/CreatePrescription';
import ViewPrescription from './pages/Psychiatrist/ViewPrescription';


function App() {

  return (
    <ProfileProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/example-use" element={<ExampleUse />} />
        <Route path="/signup" element={<SignUp/>} ></Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/general-user-signin" element={<GeneralUserSignIn />} />
        <Route path="/counsellor-dashboard" element={
          <ProtectedRoute>
            <CounsellorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/psychiatrist-dashboard" element={<PsychiatristDashboard />} />
  {/* Counsellor protected routes */}
  <Route path="/counsellor-blogs" element={<ProtectedRoute><CounsellorBlogs /></ProtectedRoute>} />
  <Route path="/counsellor-sessions" element={<ProtectedRoute><CounsellorSessions /></ProtectedRoute>} />
  <Route path="/counsellor-session-details" element={<ProtectedRoute><CounsellorSessionDetails /></ProtectedRoute>} />
  <Route path="/counsellor/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
  <Route path="/counsellor/edit-blog/:blogId" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
  <Route path="/counsellor/chats" element={<ProtectedRoute><CounsellorChats /></ProtectedRoute>} />
  <Route path="/counsellor-profile" element={<ProtectedRoute><CounsellorProfile /></ProtectedRoute>} />
  <Route path="/counsellor-calendar" element={<ProtectedRoute><CounsellorCalendar /></ProtectedRoute>} />
  <Route path="/counsellor-clients" element={<ProtectedRoute><CounsellorClients /></ProtectedRoute>} />
  <Route path="/counsellor/earnings" element={<ProtectedRoute><CounsellorEarnings /></ProtectedRoute>} />
  <Route path="/counsellor-clients/:clientId" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />

  {/* Error routes */}
  <Route path="/forbidden" element={<ForbiddenPage />} />
  <Route path="*" element={<NotFoundPage />} />
        <Route path="/psychiatrist-chats" element={<PsychiatristChat />} />
        <Route path="/psychiatrist-sessions" element={<PsychiatristSessions />} />
        <Route path="/psychiatrist-session-details" element={<PsychiatristSessionDetails />} />
        <Route path="/psychiatrist-feedbacks" element={<PsychiatristFeedbacks />} />
        <Route path="/psychiatrist-patients" element={<PsychiatristPatients />} />
        <Route path="/psychiatrist-patients/:clientId" element={<PatientDetails />} />
        <Route path="/psychiatrist/create-prescription" element={<CreatePrescription />} />
        <Route path="/psychiatrist/view-prescription/:prescriptionId" element={<ViewPrescription />} />
        
        </Routes>
      </Router>
    </ProfileProvider>
  );
}

export default App