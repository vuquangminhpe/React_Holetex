/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar({ isOpen, toggleSidebar }) {
  const user = useSelector((state) => state.user.currentUser);
  // chưa có toggle ,....
  return (
    <div
      className={`bg-gray-200 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
    >
      <div className="flex items-center space-x-2 px-4">
        <img
          src="/path-to-user-avatar.png"
          alt="User Avatar"
          className="h-8 w-8 rounded-full"
        />
        <span>{user?.fullName}</span>
      </div>
      <nav>
        <Link
          to="/"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900"
        >
          Home
        </Link>
        <Link
          to="/assignments"
          className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900 ${
            location.pathname === "/assignments"
              ? "bg-gray-300 text-gray-900"
              : ""
          }`}
        >
          Assignments
        </Link>
        <Link
          to="/upcoming-slots"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900"
        >
          Upcoming slots
        </Link>
        <Link
          to="/user-guide"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900"
        >
          Read user guide
        </Link>
        <Link
          to="/support"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900"
        >
          Contact Support
        </Link>
        <Link
          to="/faq"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900"
        >
          Frequently Asked Questions
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
