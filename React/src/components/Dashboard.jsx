import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCourses } from "../slices/userSlice";
import Sidebar from "./Sidebar";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [semester, setSemester] = useState("SUMMER2024");
  const user = useSelector((state) => state.user.currentUser);
  const courses = useSelector((state) => state.user.courses);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const enrollmentsResponse = await axios.get(
          `http://localhost:3001/enrollments?userId=${user.id}`
        );
        const courseIds = enrollmentsResponse.data.map(
          (enrollment) => enrollment.courseId
        );

        const coursesResponse = await axios.get(
          `http://localhost:3001/courses?id=${courseIds.join("&id=")}`
        );
        dispatch(setCourses(coursesResponse.data));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [user, navigate, dispatch]);
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
        {" "}
        <header className="bg-white shadow-md p-4 flex items-center">
          <div className="flex items-center space-x-4">
            <button className="px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              COURSE
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              PROJECT
            </button>
          </div>
          <span>APHL</span>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              <div className="container mx-auto px-6 py-8">
                <div className="mb-4">
                  <label
                    htmlFor="semester"
                    className="block text-sm font-medium text-gray-700"
                  >
                    SEMESTER
                  </label>
                  <select
                    id="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option>SUMMER2024</option>
                  </select>
                </div>
                <h2 className="text-lg font-medium text-blue-600 mb-4">
                  Recently Updated (Để xem chi tiết về các thay đổi cập nhật gần
                  đây, vui lòng nhấp vào đây)
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          ({course.id} → [{semester}])
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {course.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {course.code}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {course.instructor}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Number of students: {course.maxStudents}
                        </p>
                        <button
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-500"
                        >
                          Go to course →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
          <p className="float-right text-green-400 text-center text-sm text-gray-500">
            Online: {9927}
          </p>
        </main>
      </div>
    </div>

    // chưa làm phân trang
  );
}

export default Dashboard;
