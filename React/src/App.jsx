import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CourseDetails from "./components/CourseDetails";
import QuestionDiscussion from "./components/QuestionDiscussion";
import Login from "./components/Login";
import AssignmentList from "./components/AssignmentList";
import AssignmentDetails from "./components/AssignmentDetails";
import UpcomingSlots from "./components/UpcomingSlots";
import SlotDetails from "./components/SlotDetails";
import ContactSupportPopup from "./components/subSidebar/ContactSupportPopup";
import FAQPopup from "./components/subSidebar/FAQPopup";

function App() {
  const [isContactSupportOpen, setIsContactSupportOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleContactSupport = () => {
    setIsContactSupportOpen(true);
  };

  const handleFAQ = () => {
    setIsFAQOpen(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onContactSupport={handleContactSupport}
          onFAQ={handleFAQ}
        />
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/assignments" element={<AssignmentList />} />
            <Route path="/assignments/:id" element={<AssignmentDetails />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route
              path="/questions/:questionId"
              element={<QuestionDiscussion />}
            />
            <Route path="/upcoming-slots" element={<UpcomingSlots />} />
            <Route path="/slots/:id" element={<SlotDetails />} />
          </Routes>
        </div>
        <ContactSupportPopup
          isOpen={isContactSupportOpen}
          onClose={() => setIsContactSupportOpen(false)}
        />
        <FAQPopup isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
