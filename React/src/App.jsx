import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CourseDetails from "./components/CourseDetails";
import QuestionDiscussion from "./components/QuestionDiscussion";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/questions/:questionId" element={<QuestionDiscussion />} />
      </Routes>
    </Router>
  );
}

export default App;
