import React from "react";
import { NavLink } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaListAlt,
  FaLightbulb,
  FaChartLine,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

const navLinks = (logout) => ({
  menu: [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Emergency Contacts", icon: <FaFileAlt />, path: "emergency" },
    { name: "Safety Tips", icon: <FaListAlt />, path: "safety-tips" },
    { name: "Chat Support", icon: <FaChartLine />, path: "chat" },
  ],
  other: [
    { name: "Settings", icon: <FaCog />, path: "settings" },
    { name: "Help Center", icon: <FaQuestionCircle />, path: "help-center" },
    {
      name: "Logout",
      icon: <FaSignOutAlt />,
      danger: true,
      path: "/logout",
      onClick: logout,
    },
  ],
});

const Sidebar = ({ onLinkClick }) => {
  const { logout, unreadCount } = useAdmin();
  const links = navLinks(logout);

  const handleLogout = async () => {
    try {
      await logout();
      onLinkClick?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside className="w-64 h-full shadow-md rounded-2xl m-0 md:m-3 flex flex-col p-4 bg-safecity-surface">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-safecity-accent">
            <FaShieldAlt className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-safecity-text">
            Admin <span className="text-safecity-accent">Panel</span>
          </h1>
        </div>

        <button
          onClick={onLinkClick}
          className="md:hidden p-2 rounded-lg hover:bg-safecity-accent/20 transition duration-200"
        >
          <FaTimes className="w-5 h-5 text-safecity-text hover:text-safecity-accent" />
        </button>
      </div>

      {/* Menu Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-safecity-muted text-xs font-semibold">MENU</p>
          <div className="flex-1 border-b border-gray-700/30"></div>
        </div>

        <ul className="space-y-1">
          {links.menu.map((link, index) => (
            <li key={index} className="relative">
              <NavLink
                to={link.path}
                onClick={onLinkClick}
                end={link.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2 py-2 rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? "bg-safecity-accent text-white font-semibold"
                      : "text-safecity-text hover:text-white hover:bg-safecity-accent/60"
                  }`
                }
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {link.icon}
                </span>
                <span className="flex-1">{link.name}</span>

                {link.name === "Chat Support" && unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center bg-safecity-accent text-white text-xs font-semibold rounded-full px-2 py-0.5 min-w-[22px] h-6">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mb-6"></div>

        {/* Other Section */}
        <div className="flex items-center gap-2 mb-4">
          <p className="text-safecity-muted text-xs font-semibold">OTHER</p>
          <div className="flex-1 border-b border-gray-700/30"></div>
        </div>

        <ul className="space-y-1">
          {links.other.map((link, index) => (
            <li key={index}>
              {link.danger ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer text-safecity-text hover:bg-safecity-accent hover:text-gray-900 w-full text-left"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    {link.icon}
                  </span>
                  <span className="flex-1">{link.name}</span>
                </button>
              ) : (
                <NavLink
                  to={link.path}
                  onClick={onLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2 py-2 rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? "bg-safecity-accent text-white font-semibold"
                        : "text-safecity-text hover:text-white hover:bg-safecity-accent/60"
                    }`
                  }
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    {link.icon}
                  </span>
                  <span className="flex-1">{link.name}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
