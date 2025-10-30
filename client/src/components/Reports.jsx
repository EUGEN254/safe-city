import React from "react";
import assets from "../assets/assets";


const reports = [
  {
    id: 1,
    title: "Road Accident near City Mall",
    description: "A collision involving two vehicles. Police on site.",
    image:assets.road,
  },
  {
    id: 2,
    title: "Fire Outbreak in Downtown Market",
    description: "Firefighters are battling a blaze in the main market area.",
    image:assets.fire,
  },
  {
    id: 3,
    title: "Flooding on Riverside Avenue",
    description: "Heavy rain caused flooding — residents urged to avoid area.",
    image:assets.flooding,
  },
];

const Reports = () => {
  return (
    <section className="py-16 px-6 md:px-16  text-safecity-text" id="reports">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-safecity-accent">
          Recent Reports
        </h2>
        <p className="text-safecity-muted mt-2">
          Stay updated with the latest incidents in your community
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((report, index) => (
          <div
            key={report.id}
            className="bg-safecity-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-2 transition-all duration-300 ease-out"
            style={{
              animation: `floatAnim ${3 + index}s ease-in-out infinite`,
              animationDelay: `${index * 0.3}s`,
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

    </section>
  );
};

export default Reports;
