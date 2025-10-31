import React from "react";
import { FaLocationArrow, FaMap, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaLocationArrow className="text-safecity-accent text-2xl md:text-5xl mb-4" />,
      title: "Report an Incident",
      description:
        "Quickly report safety issues with photos and clear descriptions to alert your community.",
    },
    {
      icon: <FaMap className="text-safecity-accent text-2xl md:text-5xl mb-4" />,
      title: "View Map & Alerts",
      description:
        "Explore real-time incident maps and get notified about safety updates near you.",
    },
    {
      icon: <FaBell className="text-safecity-accent text-2xl md:text-5xl mb-4" />,
      title: "Receive Updates",
      description:
        "Stay informed with instant alerts and community-driven safety insights.",
    },
  ];

  return (
    <section
      className="bg-safecity-dark text-safecity-text py-16 md:py-20 px-6 md:px-20"
      id="how-it-works"
    >
      {/* Title */}
      <motion.div
        className="text-center mb-12 md:mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="text-3xl md:text-5xl font-extrabold text-safecity-accent mb-4 tracking-wide">
          How It Works
        </h3>
        <p className="text-safecity-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Follow these simple steps to help make your city smarter, safer, and more connected.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="md:grid md:grid-cols-3 md:gap-10">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-safecity-surface p-2 rounded-2xl shadow-lg border border-safecity-dark 
                       hover:scale-105 hover:shadow-2xl hover:border-safecity-accent transition-all duration-500 
                       flex flex-col items-center text-center cursor-pointer h-full"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            {step.icon}
            <h4 className="text-1xl font-semibold mb-2">{step.title}</h4>
            <p className="text-safecity-muted text-sm leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
