import React from "react";
import { FaLocationArrow, FaMap, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaLocationArrow className="text-safecity-accent text-xl md:text-4xl mb-3" />,
      title: "Report an Incident",
      description: "Quickly report safety issues with photos and clear descriptions to alert your community.",
    },
    {
      icon: <FaMap className="text-safecity-accent text-xl md:text-4xl mb-3" />,
      title: "View Map & Alerts",
      description: "Explore real-time incident maps and get notified about safety updates near you.",
    },
    {
      icon: <FaBell className="text-safecity-accent text-xl md:text-4xl mb-3" />,
      title: "Receive Updates",
      description: "Stay informed with instant alerts and community-driven safety insights.",
    },
  ];

  return (
    <section
      className="bg-safecity-dark text-safecity-text py-12 md:py-16 px-4 md:px-16"
      id="how-it-works"
    >
      {/* Title */}
      <motion.div
        className="text-center mb-8 md:mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="text-2xl md:text-4xl font-extrabold text-safecity-accent mb-3 tracking-wide">
          How It Works
        </h3>
        <p className="text-safecity-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Follow these simple steps to help make your city smarter, safer, and more connected.
        </p>
      </motion.div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-safecity-surface p-6 rounded-xl shadow-lg border border-safecity-dark 
                       hover:scale-105 hover:shadow-xl hover:border-safecity-accent transition-all duration-300 
                       flex flex-col items-center text-center cursor-pointer h-full"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            {step.icon}
            <h4 className="text-lg font-semibold mb-2 text-safecity-accent">{step.title}</h4>
            <p className="text-safecity-muted text-sm leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Horizontal Scroll without scrollbar */}
      <div className="relative">
        <div className="flex md:hidden overflow-x-auto pb-4 gap-3 snap-x snap-mandatory no-scrollbar">
          {/* Left padding */}
          <div className="flex-shrink-0 w-3"></div>
          
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 snap-start"
            >
              <div className="bg-safecity-surface p-4 rounded-xl shadow-lg border border-safecity-dark 
                             hover:shadow-lg hover:border-safecity-accent transition-all duration-300 
                             flex flex-col items-center text-center cursor-pointer h-full mx-1">
                {step.icon}
                <h4 className="text-base font-semibold mb-2 text-safecity-accent">{step.title}</h4>
                <p className="text-safecity-muted text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
          
          {/* Right padding */}
          <div className="flex-shrink-0 w-3"></div>
        </div>

        {/* Custom small scroll indicator */}
        <div className="flex md:hidden justify-center mt-4">
          <div className="w-20 h-1 bg-safecity-muted bg-opacity-30 rounded-full">
            <div className="w-6 h-1 bg-safecity-accent rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;