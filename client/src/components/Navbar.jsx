import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("header");

  // Detect which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["header", "how-it-works", "reports", "contact"];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is in viewport
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Home", section: "header", path: "/" },
    { name: "How It Works", section: "how-it-works", path: "/" },
    { name: "Reports", section: "reports", path: "/" },
    { name: "Contact Us", section: "footer", path: "/" },
    { name: "Get Started", path: "/login", isButton: true },
  ];

  return (
    <nav className="flex items-center justify-between m-2 gap-22 px-26 py-4 text-safecity-text">
      {/* Logo Section */}
      <div className="flex items-center -ml-7 gap-2 text-xl font-semibold">
        <FaShieldAlt className="text-safecity-accent text-3xl" />
        <span className="text-3xl">SafeCity</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-9 ml-10">
        {navLinks.map((link, index) =>
          link.isButton ? (
            <NavLink
              key={index}
              to={link.path}
              className="bg-safecity-accent hover:bg-safecity-accent-hover text-white px-4 py-2 rounded-lg transition"
            >
              {link.name}
            </NavLink>
          ) : (
            <button
              key={index}
              onClick={(e) => handleNavClick(link.section, e)}
              className={`text-sm hover:text-safecity-accent transition ${
                activeSection === link.section ? "text-safecity-accent" : "text-safecity-text"
              }`}
            >
              {link.name}
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;