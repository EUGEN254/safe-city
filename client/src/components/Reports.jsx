import React from "react";
import { motion } from "framer-motion";
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
  {
    id: 4,
    title: "Power Outage in North District",
    description: "Electrical maintenance causing temporary blackouts.",
    image: assets.flooding, // Consider using different images
  },
  {
    id: 5,
    title: "Traffic Jam on Highway 5",
    description: "Major delays due to construction work.",
    image: assets.flooding,
  },
  {
    id: 6,
    title: "Water Main Break Downtown",
    description: "Emergency repairs underway, road closures in effect.",
    image: assets.flooding,
  },
];

const Reports = () => {
  return (
    <section className="py-10 px-4 md:px-17 text-safecity-text bg-safecity-dark" id="reports">
      {/* Heading */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-safecity-accent">
          Recent Reports
        </h2>
        <p className="text-safecity-muted mt-2 text-sm md:text-base">
          Stay updated with the latest incidents in your community
        </p>
      </motion.div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            className="bg-safecity-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-2 transition-all duration-300 ease-out"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <img
              src={report.image}
              alt={report.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-safecity-accent mb-2">
                {report.title}
              </h3>
              <p className="text-safecity-muted text-sm">{report.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Horizontal scroll with better spacing */}
      <div className="flex md:hidden overflow-x-auto pb-8 gap-4 scrollbar-thin scrollbar-thumb-safecity-accent scrollbar-track-safecity-dark">
        {/* Add left padding for better scroll start */}
        <div className="flex-shrink-0 w-4"></div>
        
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            className="flex-shrink-0 w-80 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="bg-safecity-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                           transform hover:-translate-y-1 transition-all duration-300 ease-out h-full mx-2">
              <img
                src={report.image}
                alt={report.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-safecity-accent mb-2 line-clamp-2">
                  {report.title}
                </h3>
                <p className="text-safecity-muted text-sm line-clamp-2">
                  {report.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Add right padding for better scroll end */}
        <div className="flex-shrink-0 w-4"></div>
      </div>

      {/* Scroll indicator for mobile */}
      <div className="flex md:hidden justify-center mt-6 space-x-2">
        {reports.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-safecity-muted opacity-30 transition-all duration-300"
          ></div>
        ))}
      </div>

      {/* Load More Button */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
      </motion.div>
    </section>
  );
};

export default Reports;