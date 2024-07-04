import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse, fetchSlots } from "../store/courseSlice";
import Sidebar from "./Sidebar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const fetchPaginatedSlots = (
  slots,
  page,
  itemsPerPage,
  activity,
  slotFilter,
  filterClassName
) => {
  let filteredSlots = slots;

  if (activity !== "All Activities") {
    // chưa viết
  }
  if (slotFilter === "All") {
    filteredSlots = filteredSlots.map((slot) => slot);
  }
  if (slotFilter !== "All") {
    filteredSlots = filteredSlots.filter(
      (slot) => slot.number.toString() === slotFilter
    );
  }

  if (filterClassName) {
    filteredSlots = filteredSlots.filter(
      (slot) => slot.className === filterClassName
    );
  }

  const totalItems = filteredSlots.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSlots = filteredSlots.slice(startIndex, endIndex);

  return {
    slots: paginatedSlots,
    currentPage: page,
    totalPages: totalPages,
    hasMore: page < totalPages,
  };
};

function CourseDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { course, slots, status, error } = useSelector((state) => state.course);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(true);
  const [expandedSlots, setExpandedSlots] = useState({});
  const [filterActivity, setFilterActivity] = useState("All Activities");
  const [filterSlot, setFilterSlot] = useState("All");
  const [filterClassName, setFilterClassName] = useState("");
  const { courseId } = useParams();
  const itemsPerPage = 2;

  useEffect(() => {
    dispatch(fetchCourse(courseId));
    dispatch(fetchSlots(courseId));
  }, [dispatch, courseId]);

  const toggleFilter = () => setShowFilter(!showFilter);

  const toggleSlotExpansion = (slotId) => {
    setExpandedSlots((prev) => ({ ...prev, [slotId]: !prev[slotId] }));
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/questions/${questionId}`);
  };

  const getPaginatedSlots = useCallback(() => {
    return fetchPaginatedSlots(
      slots,
      currentPage,
      itemsPerPage,
      filterActivity,
      filterSlot,
      filterClassName
    );
  }, [slots, currentPage, filterActivity, filterSlot, filterClassName]);

  const {
    data: paginatedSlotsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "paginatedSlots",
      currentPage,
      filterActivity,
      filterSlot,
      filterClassName,
    ],
    queryFn: getPaginatedSlots,
    placeholderData: keepPreviousData,
  });

  if (status === "loading" || isLoading) return <div>Loading...</div>;
  if (status === "failed" || isError) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col ">
        <h1 className="text-2xl font-bold">{course?.name}</h1>
        <h2 className="text-xl text-gray-600">{course?.code}</h2>
        <nav className="text-sm text-blue-600 mb-4">
          <Link to="/">Home</Link> / {course?.name}
        </nav>
        <button onClick={toggleFilter} className="text-blue-600 underline mb-4">
          SHOW/HIDE (HIỆN/ẨN)
        </button>
        {showFilter && (
          <div className="filter-section mb-4 space-y-2">
            <select
              value={filterActivity}
              onChange={(e) => setFilterActivity(e.target.value)}
              className="border rounded px-2 py-1 mr-2"
            >
              <option value="All Activities">All Activities</option>
            </select>
            <select
              value={filterSlot}
              onChange={(e) => setFilterSlot(e.target.value)}
              className="border rounded px-2 py-1 mr-2"
            >
              <option value="All">All</option>
              {slots.map((slot) => (
                <option key={slot.id} value={slot.number}>
                  Slot: {slot.number}
                </option>
              ))}
            </select>
            <select
              value={filterClassName}
              onChange={(e) => setFilterClassName(e.target.value)}
              className="border rounded px-2 py-1 mr-2"
            >
              <option value={course?.code}>{course?.code}</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              LEARNING MATERIALS
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              ASSIGNMENTS
            </button>
          </div>
        )}
        <p className="text-sm mb-4">TEACHERS: {course?.instructor}</p>
        {paginatedSlotsData?.slots.map((slot) => (
          <div
            key={slot.id}
            className="slot-section bg-white p-4 rounded-lg shadow mb-4"
          >
            <h3 className="font-bold text-blue-600 cursor-pointer">
              Slot {slot.number}
            </h3>
            <p className="text-sm text-gray-600">{slot.dateTime}</p>
            <ul className="list-disc pl-5 mt-2">
              {slot.topics.map((topic, index) => (
                <li key={index} className="text-sm">
                  {topic}
                </li>
              ))}
            </ul>
            <h4
              onClick={() => toggleSlotExpansion(slot.id)}
              className="font-bold mt-4"
            >
              QUESTION {expandedSlots[slot.id] ? "▼" : "▶"}
            </h4>
            {expandedSlots[slot.id] && (
              <>
                {slot.questions.map((question) => (
                  <div
                    key={question.id}
                    className="flex justify-between text-sm mt-2 cursor-pointer"
                    onClick={() => handleQuestionClick(question.id)}
                  >
                    <p>{question.content}</p>
                    <span className="text-orange-500 mr-2">
                      {question.status}
                    </span>
                    <span className="text-blue-500">{question.progress}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
        <div className="pagination flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded"
          >
            Prev
          </button>
          <span className="px-2 py-1 bg-blue-500 text-white rounded">
            {currentPage}
          </span>
          <button
            onClick={() =>
              setCurrentPage((old) =>
                Math.min(old + 1, paginatedSlotsData?.totalPages || 1)
              )
            }
            disabled={!paginatedSlotsData?.hasMore}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(paginatedSlotsData?.totalPages || 1)}
            disabled={currentPage === (paginatedSlotsData?.totalPages || 1)}
            className="px-2 py-1 border rounded"
          >
            Last
          </button>
          <span className="px-2 py-1 border rounded">All</span>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
