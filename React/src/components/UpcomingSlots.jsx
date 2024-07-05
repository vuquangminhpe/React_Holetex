import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function UpcomingSlots() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [slots, setSlots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [slotsPerPage] = useState(4);
  // eslint-disable-next-line no-unused-vars
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchSlots = async () => {
      const response = await axios.get("http://localhost:3001/slots");
      setSlots(response.data);
    };
    fetchSlots();
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <header className="bg-white shadow-md p-4 flex items-center">
          <h1 className="text-2xl font-bold mb-4">Upcoming Slots</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSlots.map((slot) => (
            <div key={slot.id} className="mb-4 p-4 border rounded">
              <div
                className={`inline-block px-2 py-1 rounded text-white ${
                  slot.status === "Completed" ? "bg-gray-500" : "bg-green-500"
                }`}
              >
                {slot.status === "Completed" ? "Completed" : "Upcoming"}
              </div>
              <h2 className="text-xl font-semibold mt-2">
                {slot.topics.join(", ")}
              </h2>
              <p>Subject: {slot.courseId}</p>
              <p>Time: {slot.dateTime}</p>
              <p>Class: SE1830-NJ</p>
              <p>Number of students: 30</p>
              <Link
                to={`/slots/${slot.id}`}
                className="text-blue-500 hover:underline"
              >
                Continue →
              </Link>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(slots.length / slotsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default UpcomingSlots;
