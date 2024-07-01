import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse, fetchSlots } from "../store/courseSlice";
import Sidebar from "./Sidebar";

function CourseDetails() {
  const dispatch = useDispatch();
  const { course, slots, status, error } = useSelector((state) => state.course);
  const [currentPage, setCurrentPage] = useState(1);
  const { courseId } = useParams();
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCourse(courseId));
    dispatch(fetchSlots(courseId));
  }, [dispatch, courseId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSlots = slots.slice(indexOfFirstItem, indexOfLastItem);

  // eslint-disable-next-line no-unused-vars
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">{course?.name}</h1>
          <p>{course?.code}</p>
        </header>

        <nav className="bg-gray-200 p-2">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>{" "}
          / {course?.name}
        </nav>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="mb-4 flex items-center space-x-4">
            {/* Filters and buttons */}
          </div>

          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-4">SHOW/HIDE (HIỆN/ẨN)</h2>
            <p className="mb-4">TEACHERS: {course?.instructor}</p>

            {currentSlots.map((slot) => (
              <div key={slot.id} className="mb-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Slot {slot.number}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{slot.dateTime}</p>
                <ul className="list-disc pl-5 mb-4">
                  {slot.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
                <div>
                  <h4 className="font-semibold mb-2">QUESTION</h4>
                  {slot.questions.map((question) => (
                    <div
                      key={question.id}
                      className="flex items-center justify-between mb-2 bg-gray-100 p-2 rounded"
                    >
                      <Link
                        to={`/questions/${question.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {question.content}
                      </Link>
                      <div>
                        <span className="text-blue-600 mr-2">
                          {question.status}
                        </span>
                        <span className="text-green-600">
                          {question.progress}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center space-x-2">
            {/* Pagination */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CourseDetails;
