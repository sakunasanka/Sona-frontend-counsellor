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
import CreatePrescription from './pages/Psychiatrist/CreatePrescription';
import ViewPrescription from './pages/Psychiatrist/ViewPrescription';
import MeetingPage from './pages/Counsellor/MeetingPage';


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
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <CounsellorDashboard />
          </ProtectedRoute>
        } />

  {/* Counsellor protected routes */}
  <Route path="/blogs" element={<ProtectedRoute><CounsellorBlogs /></ProtectedRoute>} />
  <Route path="/sessions" element={<ProtectedRoute><CounsellorSessions /></ProtectedRoute>} />
  <Route path="/session-details" element={<ProtectedRoute><CounsellorSessionDetails /></ProtectedRoute>} />
  <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
  <Route path="/edit-blog/:blogId" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
  <Route path="/chats" element={<ProtectedRoute><CounsellorChats /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><CounsellorProfile /></ProtectedRoute>} />
  <Route path="/calendar" element={<ProtectedRoute><CounsellorCalendar /></ProtectedRoute>} />
  <Route path="/clients" element={<ProtectedRoute><CounsellorClients /></ProtectedRoute>} />
  <Route path="/earnings" element={<ProtectedRoute><CounsellorEarnings /></ProtectedRoute>} />
  <Route path="/clients/:clientId" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
  <Route path="/meeting/:sessionId/:clientId" element={<MeetingPage />} />

  {/* Error routes */}
  <Route path="/forbidden" element={<ForbiddenPage />} />
  <Route path="*" element={<NotFoundPage />} />

          {/* Psychiatrist protected routes */}
        <Route path="/psychiatrist/create-prescription" element={<ProtectedRoute><CreatePrescription /></ProtectedRoute>} />
        <Route path="/psychiatrist/view-prescription/:prescriptionId" element={<ProtectedRoute><ViewPrescription /></ProtectedRoute>} />

        </Routes>
      </Router>
    </ProfileProvider>
  );
}

export default App