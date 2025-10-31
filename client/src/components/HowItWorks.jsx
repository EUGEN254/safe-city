import React from "react";
import { FaLocationArrow, FaMap, FaBell } from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaLocationArrow className="text-safecity-accent text-4xl md:text-5xl mb-4" />,
      title: "Report an Incident",
      description:
        "Quickly report safety issues with photos and clear descriptions to alert your community.",
    },
    {
      icon: <FaMap className="text-safecity-accent text-4xl md:text-5xl mb-4" />,
      title: "View Map & Alerts",
      description:
        "Explore real-time incident maps and get notified about safety updates near you.",
    },
    {
      icon: <FaBell className="text-safecity-accent text-4xl md:text-5xl mb-4" />,
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
      <div className="text-center mb-12 md:mb-14">
        <h3 className="text-3xl md:text-5xl font-extrabold text-safecity-accent mb-4 tracking-wide">
          How It Works
        </h3>
        <p className="text-safecity-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Follow these simple steps to help make your city smarter, safer, and
          more connected.
        </p>
      </div>

      {/* Steps - Horizontal scroll on mobile */}
      <div className="md:grid md:grid-cols-3 md:gap-10">
        {/* Mobile: Horizontal scroll container */}
        <div className="flex md:hidden overflow-x-auto pb-6 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 mr-6 snap-start scroll-ml-6"
            >
              <div
                className="bg-safecity-surface p-6 rounded-2xl shadow-lg border border-safecity-dark 
                         hover:scale-105 hover:shadow-2xl hover:border-safecity-accent transition-all duration-500 
                         flex flex-col items-center text-center cursor-pointer h-full"
              >
                {step.icon}
                <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                <p className="text-safecity-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid layout */}
        {steps.map((step, index) => (
          <div
            key={index}
            className="hidden md:flex flex-col"
          >
            <div
              className="bg-safecity-surface p-8 rounded-2xl shadow-lg border border-safecity-dark 
                       hover:scale-105 hover:shadow-2xl hover:border-safecity-accent transition-all duration-500 
                       flex flex-col items-center text-center cursor-pointer h-full"
            >
              {step.icon}
              <h4 className="text-2xl font-semibold mb-2">{step.title}</h4>
              <p className="text-safecity-muted text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default HowItWorks;