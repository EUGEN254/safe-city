import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Layout = () => {
  const { admin, loading } = useAdmin();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileSidebarOpen(false);
  };

  if (loading) {
    return null;
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block flex-shrink-0">
        {/* side bar larger screens */}
        <Sidebar />
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
        <Navbar
          onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <div className="flex-1 overflow-auto no-scrollbar">
          <div className="p-6 w-full max-w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
