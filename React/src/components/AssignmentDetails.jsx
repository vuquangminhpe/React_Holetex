import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setCurrentAssignment } from "../slices/assignmentSlice";
import Sidebar from "./Sidebar";

const AssignmentDetail = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = useParams();
  const dispatch = useDispatch();
  const assignment = useSelector((state) => state.assignment.currentAssignment);
  const [relatedQuestions, setRelatedQuestions] = useState([]);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/assignments/${id}`
        );
        dispatch(setCurrentAssignment(data));

        const questionsResponse = await axios.get(
          `http://localhost:3001/questions?courseId=${data.courseId}`
        );
        setRelatedQuestions(questionsResponse.data);
      } catch (error) {
        console.error("Error fetching assignment details:", error);
      }
    };

    fetchAssignmentDetails();
  }, [id, dispatch]);

  if (!assignment) {
    return <div>Loading...</div>;
  }

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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="">
            <header className="bg-white border-b p-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold">{assignment.name}</h1>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 flex">
              <div className="flex-grow mr-4">
                <div className="bg-white rounded-lg shadow p-6 mb-4">
                  <h2 className="text-2xl font-semibold mb-4">
                    (Assignment) {assignment.name}
                  </h2>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Content</h3>
                    <p>{assignment.content}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Additional Files</h3>
                    <button className="bg-green-500 text-white px-4 py-2 rounded">
                      GET ASSIGNMENT
                    </button>
                  </div>
                  <div className="mb-4">
                    <p>
                      DUE DATE: {assignment.dueDate} - SCORE (Điểm số của bạn):{" "}
                      {assignment.score}
                    </p>
                  </div>
                  <div className="mb-4">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left">SUBMISSION STATUS</th>
                          <th className="text-left">SUBMISSION TIME</th>
                          <th className="text-left">LINK/FILE ASSIGNMENT</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-red-500">{assignment.status}</td>
                          <td>{assignment.submissionTime}</td>
                          <td>
                            <a
                              href={assignment.linkFileAssignment}
                              className="text-blue-500 hover:underline"
                            >
                              {assignment.linkFileAssignment}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    RE-SUBMIT
                  </button>
                </div>
              </div>
              <div className="w-64 bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Table of contents</h3>
                <div className="space-y-2">
                  {relatedQuestions.map((question) => (
                    <div key={question.id} className="flex items-center">
                      <span className="mr-2 text-orange-500">◻</span>
                      <Link
                        to={`/questions/${question.id}`}
                        className="text-sm hover:underline"
                      >
                        {question.content}
                      </Link>
                      <span className="ml-auto text-xs text-blue-500">
                        {question.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </main>
            <footer className="bg-white border-t p-4">
              <p className="text-center text-sm text-gray-600">
                Online: {assignment.onlineUsers}
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignmentDetail;
