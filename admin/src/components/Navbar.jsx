import React, { useState } from "react";
import {
  FaBell,
  FaComments,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
  FaCircle,
  FaEnvelope,
  FaBars,
  FaUser,
  FaLifeRing,
} from "react-icons/fa";
import { IoIosRestaurant } from "react-icons/io";
import { useAdmin } from "../context/AdminContext";

const Navbar = ({ onMenuToggle }) => {
  const { logout, admin } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      message: "New incident reported in your area",
      time: "5 min ago",
      read: false,
      type: "incident",
    },
    {
      id: 2,
      message: "Safety alert: Road closure",
      time: "10 min ago",
      read: false,
      type: "alert",
    },
    {
      id: 3,
      message: "Weekly safety report available",
      time: "1 hour ago",
      read: true,
      type: "report",
    },
    {
      id: 4,
      message: "Community meeting reminder",
      time: "2 hours ago",
      read: true,
      type: "community",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "incident":
        return <FaCircle className="text-red-500 text-xs" />;
      case "alert":
        return <FaBell className="text-orange-500" />;
      case "report":
        return <FaCog className="text-blue-500" />;
      case "community":
        return <FaComments className="text-green-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  return (
    <div className="w-full bg-safecity-surface border-b border-gray-700 shadow-lg mt-2 rounded-2xl">
      <div className="flex items-center justify-between p-4">
        {/* Left side - Menu & Profile */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-safecity-dark transition-colors duration-200 text-safecity-text md:hidden"
          >
            <FaBars className="h-5 w-5" />
          </button>

          {/* Desktop Profile Info */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold shadow-md">
                {admin?.fullname?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-safecity-surface"></div>
            </div>

            <div className="flex flex-col">
              <div className="font-semibold text-safecity-text text-sm">
                {admin?.fullname || "Admin"}
              </div>
              <div className="text-xs text-safecity-muted">
                {admin?.email || "Admin@safecity.com"}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Icons and Actions */}
        <div className="flex items-center gap-3">
          {/* Chat Icon */}
          <button className="relative p-2 rounded-lg hover:bg-safecity-dark transition-all duration-200 group">
            <FaComments className="h-5 w-5 text-safecity-muted group-hover:text-safecity-accent transition-colors" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium">
              3
            </div>
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
              Messages
            </div>
          </button>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-safecity-dark transition-all duration-200 group"
            >
              <FaBell className="h-5 w-5 text-safecity-muted group-hover:text-safecity-accent transition-colors" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium animate-pulse">
                  {unreadCount}
                </div>
              )}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                Notifications
              </div>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-safecity-surface rounded-lg shadow-2xl border border-gray-700 z-50">
                <div className="p-4 border-b border-gray-600">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-safecity-text">
                      Notifications
                    </h3>
                    <span className="text-xs bg-red-500 px-2 py-1 rounded-full font-medium text-white">
                      {unreadCount} new
                    </span>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-600 hover:bg-safecity-dark cursor-pointer transition-colors ${
                        !notification.read
                          ? "bg-red-900/20 border-l-4 border-l-red-500"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="mt-1 flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-safecity-text">
                            {notification.message}
                          </p>
                          <p className="text-xs text-safecity-muted mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-600">
                  <button className="w-full text-center text-sm text-safecity-accent hover:text-red-400 font-medium py-2 transition-colors">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-safecity-dark transition-all duration-200 group"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {admin?.fullname?.[0]?.toUpperCase() || "A"}
              </div>
              <FaChevronDown
                className={`h-3 w-3 text-safecity-muted transition-transform duration-200 ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-56 bg-safecity-surface rounded-lg shadow-2xl border border-gray-700 nav-popover">
                <div className="p-4 border-b border-gray-600">
                  <div className="font-semibold text-safecity-text truncate">
                    {admin?.fullname || "Admin"}
                  </div>
                  <div className="text-sm text-safecity-muted truncate">
                    {admin?.email || "Admin@safecity.com"}
                  </div>
                </div>

                <div className="p-2">
                  <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-safecity-dark text-safecity-text transition-colors duration-200">
                    <FaCog className="h-4 w-4 text-safecity-muted flex-shrink-0" />
                    <span className="font-medium">Settings</span>
                  </button>

                  <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-safecity-dark text-safecity-text transition-colors duration-200">
                    <FaLifeRing className="h-4 w-4 text-safecity-muted flex-shrink-0" />
                    <span className="font-medium">Support</span>
                  </button>

                  <div className="border-t border-gray-600 my-1"></div>

                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-900/20 text-red-400 transition-colors duration-200 font-medium"
                  >
                    <FaSignOutAlt className="h-4 w-4 flex-shrink-0" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for closing dropdowns */}
      {(showNotifications || showProfileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
