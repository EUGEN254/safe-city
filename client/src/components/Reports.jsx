import React from "react";
import assets from "../assets/assets";

const reports = [
  {
    id: 1,
    title: "Road Accident near City Mall",
    description: "A collision involving two vehicles. Police on site.",
    image: assets.road,
  },
  {
    id: 2,
    title: "Fire Outbreak in Downtown Market",
    description: "Firefighters are battling a blaze in the main market area.",
    image: assets.fire,
  },
  {
    id: 3,
    title: "Flooding on Riverside Avenue",
    description: "Heavy rain caused flooding — residents urged to avoid area.",
    image: assets.flooding,
  },
];

const Reports = () => {
  return (
    <section className="py-16 px-6 md:px-16 text-safecity-text" id="reports">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-safecity-accent">
          Recent Reports
        </h2>
        <p className="text-safecity-muted mt-2 text-sm md:text-base">
          Stay updated with the latest incidents in your community
        </p>
      </div>

      {/* Reports Container - Horizontal scroll on mobile */}
      <div className="relative">
        {/* Mobile: Horizontal scroll */}
        <div className="flex md:hidden overflow-x-auto pb-6 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide gap-4">
          {reports.map((report, index) => (
            <div
              key={report.id}
              className="flex-shrink-0 w-80 snap-start scroll-ml-6"
            >
              <div
                className="bg-safecity-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                         transform hover:-translate-y-2 transition-all duration-300 ease-out h-full"
                style={{
                  animation: `floatAnim ${3 + index}s ease-in-out infinite`,
                  animationDelay: `${index * 1}s`,
                }}
              >
                <img
                  src={report.image}
                  alt={report.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-safecity-accent mb-2">
                    {report.title}
                  </h3>
                  <p className="text-safecity-muted text-sm">
                    {report.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report, index) => (
            <div
              key={report.id}
              className="bg-safecity-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-2 transition-all duration-300 ease-out"
              style={{
                animation: `floatAnim ${3 + index}s ease-in-out infinite`,
                animationDelay: `${index * 1}s`,
              }}
            >
              <img
                src={report.image}
                alt={report.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-safecity-accent mb-2">
                  {report.title}
                </h3>
                <p className="text-safecity-muted text-sm">
                  {report.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator for mobile */}
      <div className="flex md:hidden justify-center mt-4 space-x-2">
        {reports.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-safecity-muted opacity-50"
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Reports;