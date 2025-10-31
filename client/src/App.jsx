import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  return (
    <>
      {/* Customized ToastContainer with reduced size and rounded edges */}
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
        style={{
          width: "auto",
          fontSize: "14px",
        }}
      />
      <Routes>
        {/* main route */}
        <Route path="/" element={<LandingPage />} />
        {/* other routes */}
      </Routes>
    </>
  );
};

export default App;
