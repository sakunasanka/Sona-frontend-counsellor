import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import SignIn from './pages/Auth/SignIn';
import CounsellorDashboard from './pages/Counsellor/CounsellorDashboard';
import PsychiatristDashboard from './pages/Psychiatrist/PsychiatristDashboard';
import ExampleUse from './pages/ExampleUse';
import CounsellorFeedbacks from './pages/Counsellor/CounsellorFeedbacks';
import CounsellorSessions from './pages/Counsellor/CounsellorSessions';
import CounsellorBlogs from './pages/Counsellor/CounsellorBlogs';
import CreateBlog from './pages/Counsellor/CreateBlog';

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
        <Route path="/counsellor/create-blog" element={<CreateBlog />} />
      </Routes>
    </Router>
  );
}

export default App