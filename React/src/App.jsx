import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CourseDetails from "./components/CourseDetails";
import QuestionDiscussion from "./components/QuestionDiscussion";
import Login from "./components/Login";
import AssignmentList from "./components/AssignmentList";
import AssignmentDetails from "./components/AssignmentDetails";
import UpcomingSlots from "./components/UpcomingSlots";
import SlotDetails from "./components/SlotDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/assignments" element={<AssignmentList />} />
        <Route path="/assignments/:id" element={<AssignmentDetails />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/questions/:questionId" element={<QuestionDiscussion />} />
        <Route path="/upcoming-slots" element={<UpcomingSlots />} />
        <Route path="/slots/:id" element={<SlotDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
