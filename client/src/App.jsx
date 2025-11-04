import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from "react-toastify";
import Layout from "./pages/Layout";
import Dashboard from "./components/userComponents/Dashboard";
import Report from "./components/userComponents/Report";
import MyReports from "./components/userComponents/MyReports";
import SafetyTips from "./components/userComponents/SafetyTips";
import NearbySafetyServices from "./components/userComponents/NearbySafetyServices";
import ChatSupport from "./components/userComponents/ChatSupport";
import EmergencyContacts from "./components/userComponents/EmergencyContacts";
import Settings from "./components/userComponents/Settings";
import HelpCenter from "./components/userComponents/HelpCenter";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <>
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
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected / Dashboard Routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-report" element={<Report />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="safe-city-tips" element={<SafetyTips />} />
          <Route path="nearby-safety-services" element={<NearbySafetyServices />} />
          <Route path="chat" element={<ChatSupport />} />
          <Route path="emergency-contacts" element={<EmergencyContacts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help-center" element={<HelpCenter />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
