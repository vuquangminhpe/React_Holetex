import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaClipboardList,
  FaClock,
  FaBook,
  FaHeadset,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar({ isOpen, toggleSidebar, onContactSupport, onFAQ }) {
  const location = useLocation();
  const user = useSelector((state) => state.user.currentUser);

  const menuItems = [
    { path: "/", icon: FaHome, text: "Home" },
    { path: "/assignments", icon: FaClipboardList, text: "Assignments" },
    { path: "/upcoming-slots", icon: FaClock, text: "Upcoming slots" },
    {
      href: "/path/to/user/guide.pdf",
      icon: FaBook,
      text: "Read user guide",
      download: true,
    },
    { icon: FaHeadset, text: "Contact Support", onClick: onContactSupport },
    {
      icon: FaQuestionCircle,
      text: "FAQ",
      onClick: onFAQ,
    },
    { path: "/login", icon: FaSignOutAlt, text: "Log out" },
  ];

  return (
    <div
      className={`bg-gray-200 space-y-6 py-7 px-2 h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } flex flex-col items-center`}
    >
      <div className="flex items-center justify-between px-4 w-full">
        {isOpen && (
          <div>
            <img
              src="https://edunext.fpt.edu.vn/assets/logo-home-Djb_K2V0.png"
              className="w-36 h-11"
              alt="FPT University"
            />
            <div className="flex items-center mt-2">
              <svg
                className="mr-3"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6m0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20" />
              </svg>
              <span>{user?.fullName}</span>
            </div>
          </div>
        )}
        <button onClick={toggleSidebar} className="text-gray-600">
          ☰
        </button>
      </div>
      <nav className="flex flex-col items-center w-full">
        {menuItems.map((item) => {
          if (item.path) {
            return (
              <Link
                key={item.text}
                to={item.path}
                className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900 w-full ${
                  location.pathname === item.path
                    ? "bg-gray-300 text-gray-900"
                    : ""
                }`}
              >
                <item.icon className={`text-xl ${isOpen ? "mr-2" : ""}`} />
                {isOpen && <span>{item.text}</span>}
              </Link>
            );
          } else if (item.href) {
            return (
              <a
                key={item.text}
                href={item.href}
                download={item.download}
                className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900 w-full"
              >
                <item.icon className={`text-xl ${isOpen ? "mr-2" : ""}`} />
                {isOpen && <span>{item.text}</span>}
              </a>
            );
          } else {
            return (
              <button
                key={item.text}
                onClick={item.onClick}
                className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900 w-full"
              >
                <item.icon className={`text-xl ${isOpen ? "mr-2" : ""}`} />
                {isOpen && <span>{item.text}</span>}
              </button>
            );
          }
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
