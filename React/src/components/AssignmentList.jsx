import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Sidebar from "./Sidebar";
import { setAssignments } from "../slices/userSlice";
import { Link } from "react-router-dom";

const fetchAssignments = async (page) => {
  const { data } = await axios.get(
    `http://localhost:3001/assignments?page=${page}`
  );
  console.log("Fetched data:", data);
  return data;
};

const AssignmentList = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const assignments = useSelector((state) => state.user.assignments || []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAssignments = await fetchAssignments(page);
        console.log("Assignments fetched:", fetchedAssignments);
        dispatch(setAssignments(fetchedAssignments));
      } catch (error) {
        console.error("Error fetching assignments:", error); // Debugging log
      }
    };
    fetchData();
  }, [page, dispatch]);

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
                    to={`/assignments/${assignment.id}`} // Link to the details page
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
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              Previous Page
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage((old) => old + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next Page
            </button>
          </div>
        </main>
        <footer className="bg-white border-t p-4">
          {/* Removed onlineUsers */}
        </footer>
      </div>
    </div>
  );
};

export default AssignmentList;
