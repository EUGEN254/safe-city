import React, { useState, useRef, useEffect } from "react";
import { 
  FaShieldAlt, 
  FaBars, 
  FaTimes, 
  FaBell, 
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaCog
} from "react-icons/fa";
import { useSafeCity } from "../context/SafeCity.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setShowLogin }) => {
  const { 
    user, 
    logout, 
    unreadCount, 
    unreadNotifications,
    notifications,
    showNotifications,
    setShowNotifications,
    showMessages,
    setShowMessages,
    markNotificationAsRead
  } = useSafeCity();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification._id);
    // You can add navigation logic based on notification type
    if (notification.type === 'report') {
      navigate('/dashboard');
    }
    setShowNotifications(false);
  };

  const navLinks = user ? [
    { name: "Dashboard", section: "dashboard", onClick: () => navigate('/dashboard') },
    { name: "Reports", section: "reports", onClick: () => navigate('/reports') },
    { name: "How It Works", section: "how-it-works" },
    { name: "Contact Us", section: "footer" },
  ] : [
    { name: "Home", section: "header" },
    { name: "How It Works", section: "how-it-works" },
    { name: "Reports", section: "reports" },
    { name: "Contact Us", section: "footer" },
    { name: "Get Started", isButton: true },
  ];

  return (
    <nav className="w-full bg-safecity-dark text-safecity-text shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <FaShieldAlt className="text-safecity-accent text-2xl sm:text-3xl" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight">SafeCity</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) =>
              link.isButton ? (
                <button
                  key={index}
                  onClick={() => setShowLogin(true)}
                  className="bg-safecity-accent hover:bg-safecity-accent-hover text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                >
                  {link.name}
                </button>
              ) : (
                <button
                  key={index}
                  onClick={link.onClick || ((e) => handleNavClick(link.section, e))}
                  className="text-sm font-medium cursor-pointer hover:text-safecity-accent transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safecity-accent transition-all duration-300 group-hover:w-full"></span>
                </button>
              )
            )}

            {/* User is logged in - Show notifications, messages, and user menu */}
            {user && (
              <div className="flex items-center gap-4 ml-4">
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-safecity-text hover:text-safecity-accent transition-colors duration-200"
                  >
                    <FaBell className="text-xl" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-safecity-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-safecity-surface rounded-lg shadow-xl border border-safecity-accent/20 nav-popover">
                      <div className="p-4 border-b border-safecity-dark">
                        <h3 className="font-semibold text-safecity-text">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.slice(0, 10).map((notification) => (
                            <div
                              key={notification._id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 border-b border-safecity-dark cursor-pointer hover:bg-safecity-dark transition-colors ${
                                !notification.read ? 'bg-safecity-dark/50' : ''
                              }`}
                            >
                              <p className="text-safecity-text font-medium">
                                {notification.title}
                              </p>
                              <p className="text-safecity-muted text-sm mt-1">
                                {notification.message}
                              </p>
                              <p className="text-safecity-muted text-xs mt-2">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
          )
                        )) : (
                          <div className="p-4 text-center text-safecity-muted">
                            No notifications
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t border-safecity-dark">
                        <button
                          onClick={() => navigate('/notifications')}
                          className="w-full text-center text-safecity-accent hover:text-safecity-accent-hover text-sm py-2"
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <button
                  onClick={() => setShowMessages(true)}
                  className="relative p-2 text-safecity-text hover:text-safecity-accent transition-colors duration-200"
                >
                  <FaEnvelope className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-safecity-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-safecity-text hover:text-safecity-accent transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-safecity-accent rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <span className="text-sm font-medium">{user.fullname}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-safecity-surface rounded-lg shadow-xl border border-safecity-accent/20 nav-popover">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-safecity-text hover:bg-safecity-dark rounded-lg transition-colors"
                        >
                          <FaUser className="text-safecity-muted" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate('/settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-safecity-text hover:bg-safecity-dark rounded-lg transition-colors"
                        >
                          <FaCog className="text-safecity-muted" />
                          Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-safecity-text hover:bg-safecity-dark rounded-lg transition-colors"
                        >
                          <FaSignOutAlt className="text-safecity-muted" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <>
                <button className="relative p-2 text-safecity-text">
                  <FaBell className="text-xl" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-safecity-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                <button className="relative p-2 text-safecity-text">
                  <FaEnvelope className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-safecity-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-safecity-text hover:text-safecity-accent transition-colors duration-200 p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 pb-4 border-t border-gray-700 pt-4">
            {navLinks.map((link, index) =>
              link.isButton ? (
                <button
                  key={index}
                  onClick={() => {
                    setShowLogin(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-safecity-accent hover:bg-safecity-accent-hover text-white px-4 py-3 rounded-lg transition-all duration-300 shadow-md font-medium w-full text-center"
                >
                  {link.name}
                </button>
              ) : (
                <button
                  key={index}
                  onClick={(e) => {
                    if (link.onClick) {
                      link.onClick();
                    } else {
                      handleNavClick(link.section, e);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-4 hover:text-safecity-accent transition-colors duration-200 font-medium border-l-2 border-transparent hover:border-safecity-accent"
                >
                  {link.name}
                </button>
              )
            )}

            {/* Mobile user menu for logged in users */}
            {user && (
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 bg-safecity-accent rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-safecity-text font-medium">{user.fullname}</p>
                    <p className="text-safecity-muted text-sm">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-4 hover:text-safecity-accent transition-colors duration-200"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-4 hover:text-safecity-accent transition-colors duration-200"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-4 hover:text-safecity-accent transition-colors duration-200 text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;