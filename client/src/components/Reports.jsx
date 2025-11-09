import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";


const reports = [
  {
    id: 1,
    title: "Road Accident near City Mall",
    description: "A collision involving two vehicles. Police on site.",
    image: assets.road,
    location: "City Mall Roundabout",
    time: "2 hours ago",
    severity: "High",
    status: "Ongoing",
    area: "Central Business District"
  },
  {
    id: 2,
    title: "Fire Outbreak in Downtown Market",
    description: "Firefighters are battling a blaze in the main market area.",
    image: assets.fire,
    location: "Downtown Main Market",
    time: "1 hour ago",
    severity: "Critical",
    status: "Being Contained",
    area: "Market District"
  },
  {
    id: 3,
    title: "Flooding on Riverside Avenue",
    description: "Heavy rain caused flooding — residents urged to avoid area.",
    image: assets.flooding,
    location: "Riverside Avenue",
    time: "4 hours ago",
    severity: "Medium",
    status: "Monitoring",
    area: "Riverside"
  },
  {
    id: 4,
    title: "Power Outage in North District",
    description: "Electrical maintenance causing temporary blackouts.",
    image: assets.flooding,
    location: "North District Substation",
    time: "3 hours ago",
    severity: "Medium",
    status: "Under Repair",
    area: "North District"
  },
  {
    id: 5,
    title: "Traffic Jam on Highway 5",
    description: "Major delays due to construction work.",
    image: assets.flooding,
    location: "Highway 5 Exit 12",
    time: "30 minutes ago",
    severity: "Low",
    status: "Ongoing",
    area: "Eastern Corridor"
  },
  {
    id: 6,
    title: "Water Main Break Downtown",
    description: "Emergency repairs underway, road closures in effect.",
    image: assets.flooding,
    location: "5th Street & Central Ave",
    time: "5 hours ago",
    severity: "High",
    status: "Under Repair",
    area: "Downtown Core"
  },
];

const Reports = () => {
  // Function to get severity color
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ongoing': return 'text-red-400';
      case 'being contained': return 'text-orange-400';
      case 'under repair': return 'text-blue-400';
      case 'monitoring': return 'text-yellow-400';
      case 'resolved': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-4 px-4 text-safecity-text" id="reports">
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
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-safecity-accent mb-2 flex-1">
                  {report.title}
                </h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityColor(report.severity)} bg-opacity-20`}>
                  {report.severity}
                </span>
              </div>
              
              <p className="text-safecity-muted text-sm mb-3">{report.description}</p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center text-safecity-muted">
                  <span className="font-medium mr-2">Location:</span>
                  <span>{report.location}</span>
                </div>
                <div className="flex items-center text-safecity-muted">
                  <span className="font-medium mr-2">Area:</span>
                  <span>{report.area}</span>
                </div>
                <div className="flex items-center text-safecity-muted">
                  <span className="font-medium mr-2">Time:</span>
                  <span>{report.time}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Status:</span>
                  <span className={getStatusColor(report.status)}>{report.status}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Horizontal scroll without scrollbar */}
      <div className="relative">
        <div className="flex md:hidden overflow-x-auto pb-8 gap-4 snap-x snap-mandatory no-scrollbar">
          {/* Add left padding for better scroll start */}
          <div className="flex-shrink-0 w-4"></div>
          
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex-shrink-0 w-80 rounded-2xl overflow-hidden snap-start"
            >
              <div className="bg-safecity-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                             transform hover:-translate-y-1 transition-all duration-300 ease-out h-full mx-2">
                <img
                  src={report.image}
                  alt={report.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-safecity-accent mb-2 flex-1">
                      {report.title}
                    </h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityColor(report.severity)} bg-opacity-20`}>
                      {report.severity}
                    </span>
                  </div>
                  
                  <p className="text-safecity-muted text-sm mb-3 line-clamp-2">
                    {report.description}
                  </p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center text-safecity-muted">
                      <span className="font-medium mr-2">📍</span>
                      <span className="line-clamp-1">{report.location}</span>
                    </div>
                    <div className="flex items-center text-safecity-muted">
                      <span className="font-medium mr-2">🏙️</span>
                      <span>{report.area}</span>
                    </div>
                    <div className="flex items-center text-safecity-muted">
                      <span className="font-medium mr-2">🕒</span>
                      <span>{report.time}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Status:</span>
                      <span className={getStatusColor(report.status)}>{report.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add right padding for better scroll end */}
          <div className="flex-shrink-0 w-4"></div>
        </div>

        {/* Custom small scroll indicator */}
        <div className="flex md:hidden justify-center mt-4">
          <div className="w-24 h-1 bg-safecity-muted bg-opacity-30 rounded-full">
            <div className="w-8 h-1 bg-safecity-accent rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Reports;