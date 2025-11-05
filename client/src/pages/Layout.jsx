import React, { useState } from "react";
import { useSafeCity } from "../context/SafeCity";
import { Outlet, Navigate } from "react-router-dom";
import UserNavbar from "../components/userComponents/UserNavbar";
import Sidebar from "../components/userComponents/Sidebar";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, loading } = useSafeCity();

  const handleLinkClick = () => {
    setIsMobileSidebarOpen(false);
  };

  // Show nothing while loading - the HTML spinner handles initial loading
  if (loading) {
    return null;
  }

  // Redirect if user not logged in
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* sidebar (large screens) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar onLinkClick={handleLinkClick} />
      </div>

      {/* mobile sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 nav-popover lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 bg-opacity-50"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative nav-popover w-64 mt-2 h-full">
            <Sidebar onLinkClick={handleLinkClick} />
          </div>
        </div>
      )}

      {/* main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <UserNavbar onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        <div className="flex-1 overflow-auto outlet-scroll">
          <div className="p-6 w-full max-w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;