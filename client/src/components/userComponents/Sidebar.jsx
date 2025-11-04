import React from "react";
import {
  FaTachometerAlt,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaShieldAlt,
  FaFileAlt,
  FaListAlt,
  FaLightbulb,
  FaMapMarkerAlt,
  FaAddressBook,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import { useSafeCity } from "../../context/SafeCity";
import { NavLink } from "react-router-dom";

const navlinks = (logout) => ({
  menu: [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Add Report", icon: <FaFileAlt />, path: "add-report" },
    { name: "My Reports", icon: <FaListAlt />, path: "my-reports" },
    { name: "SafeCity Tips", icon: <FaLightbulb />, path: "safe-city-tips" },
    {
      name: "Nearby Safety",
      icon: <FaMapMarkerAlt />,
      path: "nearby-safety-services",
    },
    { name: "Chat Support", icon: <FaChartLine />, path: "chat" },
    {
      name: "Emergency Contacts",
      icon: <FaAddressBook />,
      path: "emergency-contacts",
    },
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
  const { logout, unreadCount = 0 } = useSafeCity();
  const links = navlinks(logout);

  const handleLogout = async () => {
    try {
      await logout();
      onLinkClick?.();
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <aside className="w-64 h-full shadow-md rounded-2xl m-0 md:m-2 flex flex-col p-4 bg-safecity-surface">
      {/* logo + title */}
      <div className="flex items-center justify-between mb-8">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-safecity-accent">
            <FaShieldAlt className="text-white w-5 h-5" />
          </div>

          <h1 className="text-lg font-bold text-safecity-text">
            Safe <span className="text-safecity-accent">City</span>
          </h1>
        </div>

        {/* Close Button for Mobile */}
        <button
          onClick={onLinkClick}
          className="md:hidden p-2 rounded-lg hover:bg-safecity-accent/20 transition duration-200"
        >
          <FaTimes className="w-5 h-5 text-safecity-text hover:text-safecity-accent" />
        </button>
      </div>

      {/* menu section */}
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
                end={link.path === "dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer
                  ${
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

                {/* unread badge only on Chat Support */}
                {link.name === "Chat Support" && unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center bg-safecity-accent text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] h-6">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mb-6" />

        {/* other section */}
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
                  className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer w-full text-left text-red-400 hover:bg-red-600/20 hover:text-red-200"
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
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer
                    ${
                      isActive
                        ? "bg-safecity-accent text-gray-900 font-semibold"
                        : "text-safecity-text hover:bg-safecity-accent hover:text-gray-900"
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
