import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import Reports from "../components/Reports";
import LoginSignUp from "../components/LoginSignUp";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="relative">
      {/* Login / Sign Up Modal */}
      <LoginSignUp showLogin={showLogin} setShowLogin={setShowLogin} />

      {/* Main Page Content */}
      <Navbar setShowLogin={setShowLogin} />
      <Header setShowLogin={setShowLogin} />
      <HowItWorks id="how-it-works" />
      <Reports id="reports" />
      <Footer id="footer" />
    </div>
  );
};

export default LandingPage;
