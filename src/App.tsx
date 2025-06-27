import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import SignIn from './pages/Auth/SignIn';
import CounsellorDashboard from './pages/Counsellor/CounsellorDashboard';
import PsychiatristDashboard from './pages/Psychiatrist/PsychiatristDashboard';
import ExampleUse from './pages/ExampleUse';
import CounsellorFeedbacks from './pages/Counsellor/CounsellorFeedbacks';
import CounsellorSessions from './pages/Counsellor/CounsellorSessions';
import CounsellorSessionDetails from './pages/Counsellor/CounsellorSessionDetails';
import CounsellorBlogs from './pages/Counsellor/CounsellorBlogs';
import CreateBlog from './pages/Counsellor/CreateBlog';
import CounsellorChats from './pages/Counsellor/CounsellorChats';
import CounsellorProfile from './pages/Counsellor/CounsellorProfile';

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
        <Route path="/counsellor/chats" element={<CounsellorChats />} />
        <Route path="/counsellor-profile" element={<CounsellorProfile />} />
      </Routes>
    </Router>
  );
}

export default App