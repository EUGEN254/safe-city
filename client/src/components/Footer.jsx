import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className=" text-safecity-muted py-10 px-8 md:px-20 mt-12"
      id="footer"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* --- Left: Logo & Description --- */}
        <div>
          <h2 className="text-2xl font-bold text-safecity-accent mb-3">
            SafeCity
          </h2>
          <p className="text-safecity-text text-sm leading-relaxed">
            Empowering communities to stay alert, report incidents, and build
            safer cities together.
          </p>
        </div>

        {/* --- Middle: Quick Links --- */}
        <div>
          <h3 className="text-lg font-semibold text-safecity-text mb-3">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="hover:text-safecity-accent transition-colors cursor-pointer">
              Home
            </li>
            <li className="hover:text-safecity-accent transition-colors cursor-pointer">
              How It Works
            </li>
            <li className="hover:text-safecity-accent transition-colors cursor-pointer">
              Reports
            </li>
            <li className="hover:text-safecity-accent transition-colors cursor-pointer">
              Contact
            </li>
          </ul>
        </div>

        {/* --- Middle-right: get  Links --- */}
        <div>
          <h3 className="text-lg font-semibold text-safecity-text  mb-3">
            Reach Us
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="hover:text-red-500 transition-colors cursor-pointer">
              Tell
            </li>
            <li className="hover:hover:text-red-500 transition-colors cursor-pointer">
              +254115418682
            </li>
            <li className="hover:hover:text-red-500 transition-colors cursor-pointer">
              Email
            </li>
            <li className="hover:hover:text-red-500 transition-colors cursor-pointer">
              bitinyoeugen@gmail.com
            </li>
          </ul>
        </div>

        {/* --- Right: Socials --- */}
        <div>
          <h3 className="text-lg font-semibold text-safecity-text mb-3">
            Connect With Us
          </h3>
          <div className="flex gap-4">
            <a
              href="#"
              className="hover:hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="hover:hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="hover:hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* --- Bottom bar --- */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-xs text-safecity-muted">
        © {new Date().getFullYear()} SafeCity. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
