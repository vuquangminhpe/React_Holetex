import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments } from "../slices/userSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import http from "../utils/http";

const fetchAssignments = async (page) => {
  const { data } = await http.get(`/assignments?_page=${page}&_limit=9`);
  return data;
};

const AssignmentList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const assignments = useSelector((state) => state.user.assignments || []);

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page") || "1", 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAssignments = await fetchAssignments(currentPage);
        dispatch(setAssignments(fetchedAssignments));
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchData();
  }, [currentPage, dispatch]);

  const handlePageChange = (newPage) => {
    navigate(`/assignments?page=${newPage}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "" : "ml-16"
        }`}
      >
        <header className="bg-white shadow-md p-4 flex items-center">
          <h1 className="text-xl font-semibold">Assignments</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {assignment.name}
                </h2>
                <p className="text-gray-600">
                  Course ID: {assignment.courseId}
                </p>
                <p className="text-gray-600">Due date: {assignment.dueDate}</p>
                <Link
                  to={`/assignments/${assignment.id}`}
                  className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Go to course →
                </Link>
              </div>
            ))}
          </div>
        </main>
        <div className="mt-8 flex justify-center space-x-4">
          <span className="px-4 py-2 bg-gray-200 rounded">
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;
