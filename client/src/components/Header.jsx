import React from "react";
import assets from "../assets/assets";

const Header = ({ setShowLogin }) => {
  return (
    <header
      id="header"
      className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 bg-safecity-dark text-safecity-text min-h-screen"
    >
      {/* ==== Left Side ==== */}
      <div className="flex flex-col gap-6 md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Your City. <br /> Your Voice. <br />{" "}
          <span className="text-safecity-accent">Stay Safe.</span>
        </h1>

        <p className="text-safecity-muted text-base md:text-lg max-w-lg mx-auto md:mx-0">
          Report issues, view incidents, and help keep your community informed.
        </p>

        {/* ==== Buttons ==== */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button
            onClick={() => setShowLogin(true)}
            className="bg-safecity-accent hover:bg-safecity-accent-hover text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
          >
            Report Now
          </button>
          <button className="bg-safecity-surface hover:bg-safecity-accent hover:text-white text-safecity-text font-semibold px-6 py-3 rounded-lg border border-safecity-accent transition-all duration-300">
            Browse Reports
          </button>
        </div>
      </div>

      {/* ==== Right Side (Map Image) ==== */}
      <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
  <img
    src={assets.map}
    alt="City map showing incidents"
    className="w-full max-w-sm md:max-w-lg h-auto max-h-[50vh] md:h-[70vh] rounded-xl md:rounded-2xl shadow-lg border border-safecity-surface hover:scale-105 transition-transform duration-500"
  />
</div>
    </header>
  );
};

export default Header;
