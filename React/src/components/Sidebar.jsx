import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaClock,
  FaBook,
  FaHeadset,
  FaQuestionCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const user = useSelector((state) => state.user.currentUser);
  const menuItems = [
    { path: "/", icon: FaHome, text: "Home" },
    { path: "/assignments", icon: FaClipboardList, text: "Assignments" },
    { path: "/upcoming-slots", icon: FaClock, text: "Upcoming slots" },
    { path: "/user-guide", icon: FaBook, text: "Read user guide" },
    { path: "/support", icon: FaHeadset, text: "Contact Support" },
    {
      path: "/faq",
      icon: FaQuestionCircle,
      text: "Frequently Asked Questions",
    },
  ];

  return (
    <div
      className={`bg-gray-200 space-y-6 py-7 px-2 h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } flex flex-col items-center`}
    >
      <div className="flex items-center justify-between px-4 w-full">
        {isOpen && (
          <div className="flex">
            <img
              src="/path-to-user-avatar.png"
              alt="User Avatar"
              className="h-8 w-8 rounded-full"
            />
            <span>{user?.fullName}</span>
          </div>
        )}
        <button onClick={toggleSidebar} className="text-gray-600">
          ☰
        </button>
      </div>
      <nav className="flex flex-col items-center w-full">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900 w-full ${
              location.pathname === item.path ? "bg-gray-300 text-gray-900" : ""
            }`}
          >
            <item.icon className={`text-xl ${isOpen ? "mr-2" : ""}`} />
            {isOpen && <span>{item.text}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
