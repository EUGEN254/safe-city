import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import Reports from "../components/Reports";

const LandingPage = () => {
  return (
    <div>
      <div>
        <Navbar />
        <Header />
        <HowItWorks id="how-it-works" />
        <Reports id="reports"/>
        <Footer id="footer" />
      </div>
    </div>
  );
};

export default LandingPage;
