import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Sidebar from "./Sidebar";
import { setAssignments } from "../slices/userSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";

const fetchAssignments = async (page) => {
  const { data } = await axios.get(
    `http://localhost:3001/assignments?_page=${page}&_limit=9`
  );
  return data;
};

const AssignmentList = () => {
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Assignments</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {assignment.name}
                  </h2>
                  <p>Course ID: {assignment.courseId}</p>
                  <p>Due date: {assignment.dueDate}</p>
                  <Link
                    to={`/assignments/${assignment.id}`}
                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View assignment
                  </Link>
                </div>
              ))
            ) : (
              <div>No assignments available</div>
            )}
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            {currentPage > 1 && (
              <Link
                to={`/assignments?page=${currentPage - 1}`}
                className="text-blue-500 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
              >
                Previous Page
              </Link>
            )}
            <span>Page {currentPage}</span>
            <Link
              to={`/assignments?page=${currentPage + 1}`}
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
            >
              Next Page
            </Link>
          </div>
        </main>
        <footer className="bg-white border-t p-4">
          {/* Footer content */}
        </footer>
      </div>
    </div>
  );
};

export default AssignmentList;
