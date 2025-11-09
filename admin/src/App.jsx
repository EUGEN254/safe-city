import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import LoginSignUp from "./pages/LoginSignUp";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import Messages from "./components/Messages";
import Layout from "./pages/Layout";

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        pauseOnHover
        closeOnClick
        draggable
        className="!z-[1000]"
        toastClassName="!min-h-12 !max-w-md !rounded-xl !shadow-lg"
        bodyClassName="!text-sm !p-3"
        progressClassName="!h-1"
        style={{ width: "auto", fontSize: "14px" }}
      />

      <Routes>
        {/* public route */}
        <Route path="/" element={<LoginSignUp />} />

        {/* protected routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Messages />} />
        </Route>

          <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  );
};

export default App;
