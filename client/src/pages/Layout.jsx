import React, { useState } from "react";
import { useSafeCity } from "../context/SafeCity";
import { Outlet, useNavigate } from "react-router-dom";
import UserNavbar from "../components/userComponents/UserNavbar";
import Sidebar from "../components/userComponents/Sidebar";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useSafeCity();
  const navigate = useNavigate()

  const handleLinkClick = () => {
    setIsMobileSidebarOpen(false);
  };

  // Redirect if user not logged in
  if (!user) return <navigate to="/" replace />;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* sidebar (large screens) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar onLinkClick={handleLinkClick} />
      </div>

      {/* mobile sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-50 w-64 h-full">
            <Sidebar onLinkClick={handleLinkClick} />
          </div>
        </div>
      )}

      {/* main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <UserNavbar onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        <div className="flex-1 overflow-auto">
          <div className="p-6 w-full max-w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
