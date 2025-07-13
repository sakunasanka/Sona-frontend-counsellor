import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import SignIn from './pages/Auth/SignIn';
import CounsellorDashboard from './pages/Counsellor/CounsellorDashboard';
import ExampleUse from './pages/ExampleUse';
import CounsellorFeedbacks from './pages/Counsellor/CounsellorFeedbacks';
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

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/example-use" element={<ExampleUse />} />
        <Route path="/signup" element={<SignUp/>} ></Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
        <Route path="/psychiatrist-dashboard" element={<PsychiatristDashboard />} />
        <Route path="/counsellor-feedbacks" element={<CounsellorFeedbacks />} />
        <Route path="/counsellor-blogs" element={<CounsellorBlogs />} />
        <Route path="/counsellor-sessions" element={<CounsellorSessions />} />
        <Route path="/counsellor-session-details" element={<CounsellorSessionDetails />} />
        <Route path="/counsellor/create-blog" element={<CreateBlog />} />
        <Route path="/counsellor/edit-blog/:blogId" element={<EditBlog />} />
        <Route path="/counsellor/chats" element={<CounsellorChats />} />
        <Route path="/counsellor-profile" element={<CounsellorProfile />} />
        <Route path="/counsellor-calendar" element={<CounsellorCalendar />} />
        <Route path="/counsellor-clients" element={<CounsellorClients />} />
        <Route path="/counsellor/earnings" element={<CounsellorEarnings />} />
        <Route path="/counsellor-clients/:clientId" element={<ClientDetails />} />
        <Route path="/psychiatrist-chats" element={<PsychiatristChat />} />
        <Route path="/psychiatrist-sessions" element={<PsychiatristSessions />} />
        <Route path="/psychiatrist-session-details" element={<PsychiatristSessionDetails />} />
        <Route path="/psychiatrist-feedbacks" element={<PsychiatristFeedbacks />} />
        <Route path="/psychiatrist-patients" element={<PsychiatristPatients />} />
        <Route path="/psychiatrist-patients/:clientId" element={<PatientDetails />} />
        <Route path="/psychiatrist/create-prescription" element={<CreatePrescription />} />
      </Routes>
    </Router>
  );
}

export default App