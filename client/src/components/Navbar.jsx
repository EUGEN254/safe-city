import React, { useState } from "react";
import { FaShieldAlt, FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ setShowLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll on click
  const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after click
  };

  const navLinks = [
    { name: "Home", section: "header" },
    { name: "How It Works", section: "how-it-works" },
    { name: "Reports", section: "reports" },
    { name: "Contact Us", section: "footer" },
    { name: "Get Started", isButton: true },
  ];

  return (
    <nav className="w-full bg-safecity-dark text-safecity-text shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-safecity-accent text-2xl sm:text-3xl" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight">SafeCity</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) =>
              link.isButton ? (
                <button
                  key={index}
                  onClick={() => setShowLogin(true)}
                  className="bg-safecity-accent hover:bg-safecity-accent-hover text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                >
                  {link.name}
                </button>
              ) : (
                <button
                  key={index}
                  onClick={(e) => handleNavClick(link.section, e)}
                  className="text-sm font-medium cursor-pointer hover:text-safecity-accent transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safecity-accent transition-all duration-300 group-hover:w-full"></span>
                </button>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-safecity-text hover:text-safecity-accent transition-colors duration-200 p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 pb-4 border-t border-gray-700 pt-4">
            {navLinks.map((link, index) =>
              link.isButton ? (
                <button
                  key={index}
                  onClick={() => {
                    setShowLogin(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-safecity-accent hover:bg-safecity-accent-hover text-white px-4 py-3 rounded-lg transition-all duration-300 shadow-md font-medium w-full text-center"
                >
                  {link.name}
                </button>
              ) : (
                <button
                  key={index}
                  onClick={(e) => handleNavClick(link.section, e)}
                  className="text-left py-2 px-4 hover:text-safecity-accent transition-colors duration-200 font-medium border-l-2 border-transparent hover:border-safecity-accent"
                >
                  {link.name}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;