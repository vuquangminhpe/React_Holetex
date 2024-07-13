import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse, fetchSlots } from "../store/courseSlice";
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
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}
      >
        {" "}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="">
            <h1 className="text-2xl font-bold">{course?.name}</h1>
            <h2 className="text-xl text-gray-600">{course?.code}</h2>
            <nav className="text-sm text-blue-600 mb-4">
              <Link to="/">Home</Link> / {course?.name}
            </nav>
            <button
              onClick={toggleFilter}
              className="text-blue-600 underline mb-4"
            >
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
                        <div className="flex">
                          <img
                            className="mr-2"
                            src="data:image/svg+xml,%3csvg%20width='28'%20height='28'%20viewBox='0%200%2028%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%208C0%203.58172%203.58172%200%208%200H20C24.4183%200%2028%203.58172%2028%208V20C28%2024.4183%2024.4183%2028%2020%2028H8C3.58172%2028%200%2024.4183%200%2020V8Z'%20fill='%23FD9246'%3e%3c/path%3e%3cg%20clip-path='url(%23clip0_5268_6432)'%3e%3cpath%20d='M23.2361%2019.9705C23.7368%2019.2061%2024%2018.3632%2024%2017.5158C24%2014.6848%2021.2575%2012.3746%2017.8333%2012.2539C17.0355%2014.6348%2014.659%2016.6282%2011.1702%2016.8785C11.1393%2017.0891%2011.1094%2017.3%2011.1094%2017.5159C11.1094%2020.4238%2014.0007%2022.7893%2017.5547%2022.7893C18.7729%2022.7893%2019.9557%2022.5049%2020.9925%2021.9642L23.2178%2022.7555C23.4266%2022.8301%2023.6668%2022.78%2023.8289%2022.6171C23.9886%2022.4568%2024.0418%2022.2188%2023.9657%2022.0054L23.2361%2019.9705ZM15.7968%2018.1018C15.7968%2018.4256%2015.5348%2018.6877%2015.2109%2018.6877C14.887%2018.6877%2014.625%2018.4256%2014.625%2018.1018V16.9299C14.625%2016.606%2014.887%2016.3439%2015.2109%2016.3439C15.5348%2016.3439%2015.7968%2016.606%2015.7968%2016.9299V18.1018ZM18.1406%2018.1018C18.1406%2018.4256%2017.8785%2018.6877%2017.5546%2018.6877C17.2308%2018.6877%2016.9687%2018.4256%2016.9687%2018.1018V16.9299C16.9687%2016.606%2017.2308%2016.3439%2017.5546%2016.3439C17.8785%2016.3439%2018.1406%2016.606%2018.1406%2016.9299V18.1018ZM20.4843%2018.1018C20.4843%2018.4256%2020.2223%2018.6877%2019.8984%2018.6877C19.5745%2018.6877%2019.3125%2018.4256%2019.3125%2018.1018V16.9299C19.3125%2016.606%2019.5745%2016.3439%2019.8984%2016.3439C20.2223%2016.3439%2020.4843%2016.606%2020.4843%2016.9299V18.1018Z'%20fill='white'%3e%3c/path%3e%3cpath%20d='M10.4453%205.21122C9.22594%205.21122%208.04379%205.4956%207.0075%206.03634L4.78219%205.24497C4.56934%205.16888%204.33074%205.22267%204.17109%205.38345C4.01145%205.54368%203.95824%205.78169%204.03434%205.99513L4.76391%208.02989C4.2632%208.79435%204%209.6372%204%2010.4847C4%2013.3926%206.89137%2015.7581%2010.4453%2015.7581C13.9125%2015.7581%2016.8906%2013.4692%2016.8906%2010.4847C16.8906%207.57669%2013.9993%205.21122%2010.4453%205.21122ZM10.4453%2013.4143C10.1217%2013.4143%209.85938%2013.152%209.85938%2012.8284C9.85938%2012.5047%2010.1217%2012.2425%2010.4453%2012.2425C10.7689%2012.2425%2011.0312%2012.5047%2011.0312%2012.8284C11.0312%2013.152%2010.7689%2013.4143%2010.4453%2013.4143ZM11.0387%2010.9681C11.0387%2011.2914%2010.7726%2011.605%2010.4493%2011.605C10.1254%2011.605%209.85934%2011.3944%209.85934%2011.0706C9.85934%2010.4795%2010.1746%2010.0326%2010.6432%209.86493C10.875%209.78138%2011.0312%209.55993%2011.0312%209.31275C11.0312%208.98946%2010.7686%208.72681%2010.4453%208.72681C10.122%208.72681%209.85934%208.98946%209.85934%209.31275C9.85934%209.63661%209.59727%209.89868%209.2734%209.89868C8.94953%209.89868%208.68746%209.63661%208.68746%209.31275C8.68746%208.34345%209.47598%207.55493%2010.4453%207.55493C11.4146%207.55493%2012.2031%208.34345%2012.2031%209.31275C12.2031%2010.0526%2011.7351%2010.7181%2011.0387%2010.9681Z'%20fill='white'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_5268_6432'%3e%3crect%20width='20'%20height='20'%20fill='white'%20transform='translate(4%204)'%3e%3c/rect%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                          ></img>
                          <p>{question.content}</p>
                        </div>
                        <span className="text-orange-500 mr-2">
                          {question.status}
                        </span>
                        <span className="text-blue-500">
                          {question.progress}
                        </span>
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
                onClick={() =>
                  setCurrentPage(paginatedSlotsData?.totalPages || 1)
                }
                disabled={currentPage === (paginatedSlotsData?.totalPages || 1)}
                className="px-2 py-1 border rounded"
              >
                Last
              </button>
              <span className="px-2 py-1 border rounded">All</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CourseDetails;
