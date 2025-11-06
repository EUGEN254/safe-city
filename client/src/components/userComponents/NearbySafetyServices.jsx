import React, { useState, useEffect } from "react";
import {
  FiMapPin,
  FiNavigation,
  FiFilter,
  FiPhone,
  FiClock,
  FiStar,
  FiAlertCircle,
  FiShield,
  FiUsers,
  FiCamera,
  FiSearch,
  FiChevronRight,
  FiHeart,
  FiShare2,
  FiInfo,
  FiHome,
} from "react-icons/fi";
import MapView from "../MapView"; 

const NearbySafetyServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [safetyServices, setSafetyServices] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingNearestTown, setIsUsingNearestTown] = useState(false);
  const [currentTown, setCurrentTown] = useState(null);

  const serviceCategories = [
    { id: "all", name: "All Services", icon: <FiShield />, color: "text-blue-400" },
    { id: "police", name: "Police Stations", icon: <FiUsers />, color: "text-blue-500" },
    { id: "hospital", name: "Hospitals", icon: <FiAlertCircle />, color: "text-red-400" },
    { id: "fire", name: "Fire Stations", icon: <FiShield />, color: "text-orange-400" },
    { id: "pharmacy", name: "24/7 Pharmacies", icon: <FiStar />, color: "text-green-400" },
    { id: "safehouse", name: "Safe Places", icon: <FiHome />, color: "text-teal-400" },
  ];

  // Essential service types we want to show
  const essentialServiceTypes = ["police", "hospital", "fire", "pharmacy", "safehouse"];

  // Service type mappings between Overpass API and our categories
  const serviceTypeMappings = {
    "police": "police",
    "hospital": "hospital", 
    "fire_station": "fire",
    "pharmacy": "pharmacy",
    "community_centre": "safehouse",
    "shelter": "safehouse",
    "social_facility": "safehouse"
  };

  // Kenyan Major Towns and Cities
  const majorTowns = [
    { name: "Nairobi", lat: -1.286389, lng: 36.817223, population: 4397000 },
    { name: "Mombasa", lat: -4.0435, lng: 39.6682, population: 1208333 },
    { name: "Kisumu", lat: -0.1022, lng: 34.7617, population: 610082 },
    { name: "Nakuru", lat: -0.3031, lng: 36.0800, population: 570674 },
    { name: "Eldoret", lat: 0.5143, lng: 35.2698, population: 475716 },
    { name: "Meru", lat: 0.0500, lng: 37.6500, population: 240900 },
    { name: "Thika", lat: -1.0395, lng: 37.0902, population: 279429 },
  ];

  useEffect(() => {
    const fetchLocationAndServices = async () => {
      try {
        setLoading(true);
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ latitude, longitude });
              
              // Try to fetch from Overpass API first
              let services = await fetchOverpassServices(latitude, longitude, 10000);
              
              // Check if we have all essential services
              const foundServiceTypes = services.map(service => service.type);
              const missingEssentialServices = essentialServiceTypes.filter(type => !foundServiceTypes.includes(type));
              
              if (missingEssentialServices.length > 0) {
                const nearestTown = findNearestTown(latitude, longitude);
                setCurrentTown(nearestTown);
                setIsUsingNearestTown(true);
                
                // Generate comprehensive mock data for the nearest town, but keep real data if available
                const townServices = generateComprehensiveMockServices(nearestTown.lat, nearestTown.lng, nearestTown.name);
                
                // Merge real services with town services, avoiding duplicates
                const mergedServices = mergeServices(services, townServices);
                
                services = mergedServices;
              }
              
              setSafetyServices(services);
              setLoading(false);
            },
            (error) => {
              console.error("Location error:", error);
              handleLocationError();
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 60000
            }
          );
        } else {
          handleLocationError();
        }
      } catch (error) {
        console.error("Error in fetchLocationAndServices:", error);
        setError("Failed to load safety services.");
        setLoading(false);
      }
    };

    fetchLocationAndServices();
  }, []);

  const mergeServices = (realServices, townServices) => {
    const merged = [...realServices];
    
    // Add town services only if we don't already have that service type
    townServices.forEach(townService => {
      const alreadyHasType = realServices.some(realService => realService.type === townService.type);
      if (!alreadyHasType) {
        merged.push(townService);
      }
    });
    
    return merged;
  };

  const handleLocationError = () => {
    setError("Unable to access your location. Using default location.");
    // Default to Meru if location access fails
    const defaultLat = 0.0500;
    const defaultLng = 37.6500;
    setUserLocation({ latitude: defaultLat, longitude: defaultLng });
    setSafetyServices(generateComprehensiveMockServices(defaultLat, defaultLng, "Meru"));
    setLoading(false);
  };

  const findNearestTown = (userLat, userLng) => {
    let nearestTown = majorTowns[0];
    let shortestDistance = calculateDistanceInKm(userLat, userLng, nearestTown.lat, nearestTown.lng);
    
    for (let i = 1; i < majorTowns.length; i++) {
      const town = majorTowns[i];
      const distance = calculateDistanceInKm(userLat, userLng, town.lat, town.lng);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestTown = town;
      }
    }
    
    return {
      ...nearestTown,
      distance: shortestDistance
    };
  };

  const fetchOverpassServices = async (lat, lng, radius = 10000) => {
    try {
      // Expanded query to include safe places and security cameras
      const query = `
        [out:json][timeout:30];
        (
          node["amenity"~"police|hospital|fire_station|pharmacy|community_centre|shelter|social_facility"](around:${radius},${lat},${lng});
          node["man_made"~"surveillance"](around:${radius},${lat},${lng});
          node["surveillance"](around:${radius},${lat},${lng});
        );
        out;
      `;

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      // Check if response is valid JSON
      if (text.startsWith('<?xml')) {
        return []; // Return empty array if rate limited
      }

      const data = JSON.parse(text);
      
      const services = data.elements.map((el, index) => {
        const serviceType = el.tags?.amenity || el.tags?.man_made || el.tags?.surveillance || "unknown";
        
        // Map Overpass service types to our category IDs
        const mappedType = serviceTypeMappings[serviceType] || 
                          (serviceType === "surveillance" ? "camera" : serviceType);
        
        let name = el.tags?.name;
        if (!name) {
          // Generate appropriate names based on type
          if (mappedType === "safehouse") {
            name = "Community Safe Space";
          } else if (mappedType === "camera") {
            name = "Security Camera";
          } else {
            name = `${mappedType.charAt(0).toUpperCase() + mappedType.slice(1)} Service`;
          }
        }
        
        return {
          id: el.id || index,
          name: name,
          type: mappedType,
          address: el.tags?.["addr:street"] 
            ? `${el.tags["addr:street"]}${el.tags["addr:housenumber"] ? ` ${el.tags["addr:housenumber"]}` : ""}`
            : "Address not available",
          coordinates: { 
            lat: el.lat, 
            lng: el.lon
          },
          distance: calculateDistance(lat, lng, el.lat, el.lon),
          rating: Math.random() > 0.3 ? (3.5 + Math.random() * 1.5).toFixed(1) : null,
          reviews: Math.random() > 0.3 ? Math.floor(Math.random() * 500) : null,
          phone: el.tags?.phone || null,
          hours: getServiceHours(mappedType),
          features: getServiceFeatures(mappedType),
          waitTime: getWaitTime(mappedType),
          isOpen: true,
          isRealData: true
        };
      });

      return services;
    } catch (error) {
      console.error("Error fetching from Overpass:", error);
      return [];
    }
  };

  const getServiceHours = (type) => {
    const hours = {
      police: "24/7",
      hospital: "24/7",
      fire: "24/7",
      pharmacy: "7:00 AM - 10:00 PM",
      camera: "24/7 Monitoring",
      safehouse: "6:00 AM - 11:00 PM"
    };
    return hours[type] || "24/7";
  };

  const getWaitTime = (type) => {
    const waitTimes = {
      hospital: "15-30 min",
      police: "5-10 min",
      fire: "2-5 min",
      pharmacy: "0-5 min",
      safehouse: "Immediate"
    };
    return waitTimes[type] || "0-5 min";
  };

  const generateComprehensiveMockServices = (lat, lng, townName) => {
    const services = [
      {
        id: 1001,
        name: `${townName} Police Station`,
        type: "police",
        address: `Main Street, ${townName}`,
        coordinates: { lat: lat + 0.005, lng: lng + 0.005 },
        distance: calculateDistance(lat, lng, lat + 0.005, lng + 0.005),
        rating: "4.2",
        reviews: 124,
        phone: null,
        hours: "24/7",
        features: ["Emergency Response", "Community Policing", "Report Filing"],
        waitTime: "5-10 min",
        isOpen: true,
        isRealData: false
      },
      {
        id: 1002,
        name: `${townName} District Hospital`,
        type: "hospital",
        address: `Hospital Road, ${townName}`,
        coordinates: { lat: lat - 0.003, lng: lng + 0.004 },
        distance: calculateDistance(lat, lng, lat - 0.003, lng + 0.004),
        rating: "4.5",
        reviews: 89,
        phone: null,
        hours: "24/7",
        features: ["Emergency Room", "Ambulance Services", "Outpatient Care"],
        waitTime: "15-30 min",
        isOpen: true,
        isRealData: false
      },
      {
        id: 1003,
        name: `${townName} Fire Station`,
        type: "fire",
        address: `Station Road, ${townName}`,
        coordinates: { lat: lat + 0.004, lng: lng - 0.003 },
        distance: calculateDistance(lat, lng, lat + 0.004, lng - 0.003),
        rating: "4.8",
        reviews: 45,
        phone: null,
        hours: "24/7",
        features: ["Fire Response", "Rescue Services", "Medical First Response"],
        waitTime: "2-5 min",
        isOpen: true,
        isRealData: false
      },
      {
        id: 1004,
        name: `${townName} Pharmacy`,
        type: "pharmacy",
        address: `Market Street, ${townName}`,
        coordinates: { lat: lat - 0.002, lng: lng - 0.002 },
        distance: calculateDistance(lat, lng, lat - 0.002, lng - 0.002),
        rating: "4.0",
        reviews: 67,
        phone: null,
        hours: "7:00 AM - 10:00 PM",
        features: ["Emergency Prescriptions", "First Aid", "Over-the-Counter"],
        waitTime: "0-5 min",
        isOpen: true,
        isRealData: false
      },
      {
        id: 1005,
        name: `${townName} Community Safe Space`,
        type: "safehouse",
        address: `Community Center, ${townName}`,
        coordinates: { lat: lat + 0.003, lng: lng + 0.002 },
        distance: calculateDistance(lat, lng, lat + 0.003, lng + 0.002),
        rating: "4.6",
        reviews: 34,
        phone: null,
        hours: "6:00 AM - 11:00 PM",
        features: ["Rest Area", "Phone Charging", "Security Personnel", "First Aid", "Counseling"],
        waitTime: "Immediate",
        isOpen: true,
        isRealData: false
      },
    ];
    
    return services;
  };

  const calculateDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const distanceKm = calculateDistanceInKm(lat1, lon1, lat2, lon2);
    return `${distanceKm.toFixed(1)} km`;
  };

  const getServiceFeatures = (type) => {
    const features = {
      police: ["Emergency Response", "Community Policing", "Report Filing", "24/7 Service"],
      hospital: ["Emergency Room", "Trauma Center", "Ambulance Services", "Medical Care"],
      fire: ["Fire Response", "Rescue Services", "Medical First Response", "Emergency Services"],
      pharmacy: ["Emergency Prescriptions", "First Aid", "Over-the-Counter", "Medical Supplies"],
      camera: ["24/7 Monitoring", "High Definition", "Police Linked", "Public Safety"],
      safehouse: ["Rest Area", "Phone Charging", "Security Personnel", "First Aid", "Counseling", "Safe Space"]
    };
    return features[type] || ["Emergency Services"];
  };

  const filteredServices = safetyServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "all" || 
      service.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getServiceIcon = (type) => {
    const category = serviceCategories.find((cat) => cat.id === type);
    return category ? category.icon : <FiMapPin />;
  };

  const getServiceColor = (type) => {
    const category = serviceCategories.find((cat) => cat.id === type);
    return category ? category.color : "text-gray-400";
  };

  const handleCallService = (phone) => {
    if (phone && window.confirm(`Call ${phone}?`)) {
      window.open(`tel:${phone}`);
    }
  };

  const handleGetDirections = (coordinates) => {
    const { lat, lng } = coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const renderServiceCard = (service) => (
    <div
      key={service.id}
      className="bg-safecity-surface rounded-xl p-4 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer border border-safecity-surface hover:border-safecity-accent"
      onClick={() => setSelectedService(service)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg bg-safecity-accent bg-opacity-20 flex items-center justify-center ${getServiceColor(
              service.type
            )}`}
          >
            {getServiceIcon(service.type)}
          </div>
          <div>
            <h3 className="text-safecity-text font-semibold">{service.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-safecity-muted">
              <FiMapPin className="text-xs" />
              <span>{service.distance} away</span>
              {!service.isRealData && (
                <span className="text-xs text-yellow-400">(Estimated)</span>
              )}
            </div>
          </div>
        </div>
        {service.rating && (
          <div className="flex items-center space-x-1 bg-safecity-dark px-2 py-1 rounded-full">
            <FiStar className="text-yellow-400 text-xs" />
            <span className="text-safecity-text text-sm">{service.rating}</span>
          </div>
        )}
      </div>

      <p className="text-safecity-muted text-sm mb-3">{service.address}</p>

      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center space-x-2">
          <FiClock className="text-safecity-muted" />
          <span className={service.isOpen ? "text-green-400" : "text-red-400"}>
            {service.isOpen ? "Open Now" : "Closed"}
          </span>
        </div>
        {service.waitTime && (
          <span className="text-safecity-muted">Wait: {service.waitTime}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {service.features.slice(0, 2).map((feature, index) => (
          <span
            key={index}
            className="bg-safecity-dark text-safecity-muted px-2 py-1 rounded text-xs"
          >
            {feature}
          </span>
        ))}
        {service.features.length > 2 && (
          <span className="bg-safecity-dark text-safecity-muted px-2 py-1 rounded text-xs">
            +{service.features.length - 2} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {service.phone ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCallService(service.phone);
            }}
            className="flex items-center space-x-2 text-safecity-accent hover:text-safecity-accent-hover transition-colors"
          >
            <FiPhone />
            <span>Call</span>
          </button>
        ) : (
          <div className="text-safecity-muted text-sm">Phone not available</div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleGetDirections(service.coordinates);
          }}
          className="flex items-center space-x-2 bg-safecity-accent hover:bg-safecity-accent-hover text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiNavigation />
          <span>Directions</span>
        </button>
      </div>
    </div>
  );

  const renderServiceDetail = () => {
    if (!selectedService) return null;
    
    return (
      <div className="min-h-screen bg-safecity-dark p-4 md:p-6">
        <button
          onClick={() => setSelectedService(null)}
          className="flex items-center space-x-2 text-safecity-accent hover:text-safecity-accent-hover mb-6 transition-colors"
        >
          <FiChevronRight className="rotate-180" />
          <span>Back to Services</span>
        </button>

        <div className="bg-safecity-surface rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-xl bg-safecity-accent bg-opacity-20 flex items-center justify-center ${getServiceColor(
                  selectedService.type
                )} text-xl`}
              >
                {getServiceIcon(selectedService.type)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-safecity-text">
                  {selectedService.name}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-safecity-muted mt-1">
                  <span>{selectedService.distance} away</span>
                  <span>•</span>
                  <span
                    className={
                      selectedService.isOpen ? "text-green-400" : "text-red-400"
                    }
                  >
                    {selectedService.isOpen ? "Open Now" : "Closed"}
                  </span>
                  {!selectedService.isRealData && (
                    <span className="text-yellow-400 text-sm">(Estimated Location)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="p-2 rounded-lg bg-safecity-dark text-safecity-muted hover:text-safecity-accent transition-colors">
                <FiHeart />
              </button>
              <button className="p-2 rounded-lg bg-safecity-dark text-safecity-muted hover:text-safecity-accent transition-colors">
                <FiShare2 />
              </button>
            </div>
          </div>

          {/* Map View */}
          <div className="bg-safecity-dark rounded-xl h-48 mb-6 overflow-hidden">
            <MapView
              center={[selectedService.coordinates.lat, selectedService.coordinates.lng]}
              markers={[{
                lat: selectedService.coordinates.lat,
                lng: selectedService.coordinates.lng,
                name: selectedService.name,
                address: selectedService.address,
                type: selectedService.type,
              }]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-safecity-text mb-3">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiMapPin className="text-safecity-muted" />
                  <span className="text-safecity-text">
                    {selectedService.address}
                  </span>
                </div>
                {selectedService.phone ? (
                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-safecity-muted" />
                    <span className="text-safecity-text">
                      {selectedService.phone}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 text-safecity-muted">
                    <FiPhone className="text-safecity-muted" />
                    <span>Phone number not available</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <FiClock className="text-safecity-muted" />
                  <span className="text-safecity-text">
                    {selectedService.hours}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-safecity-text mb-3">
                Service Details
              </h3>
              <div className="space-y-2">
                {selectedService.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-safecity-accent rounded-full"></div>
                    <span className="text-safecity-text text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedService.rating && (
            <div className="bg-safecity-dark rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-safecity-text mb-3">
                Ratings & Reviews
              </h3>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-safecity-text">
                    {selectedService.rating}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`text-sm ${
                          star <= Math.floor(selectedService.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-safecity-muted text-sm mt-1">
                    {selectedService.reviews} reviews
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            {selectedService.phone ? (
              <button
                onClick={() => handleCallService(selectedService.phone)}
                className="flex-1 bg-safecity-accent hover:bg-safecity-accent-hover text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FiPhone />
                <span>Call Now</span>
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-600 text-gray-400 py-3 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed"
              >
                <FiPhone />
                <span>Phone Not Available</span>
              </button>
            )}
            <button
              onClick={() => handleGetDirections(selectedService.coordinates)}
              className="flex-1 bg-safecity-surface border border-safecity-accent text-safecity-accent hover:bg-safecity-accent hover:text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <FiNavigation />
              <span>Get Directions</span>
            </button>
          </div>

          {!selectedService.isRealData && (
            <div className="mt-6 p-4 bg-gray-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg">
              <div className="flex items-center space-x-2 text-white">
                <FiInfo />
                <span className="text-sm">
                  This is an estimated location in {currentTown?.name}. The actual service location may vary.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (selectedService) {
    return renderServiceDetail();
  }

  return (
    <div className="min-h-screen bg-safecity-dark p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-safecity-text">
              Safety Services
            </h1>
            <p className="text-safecity-muted">
              {isUsingNearestTown 
                ? `Services from your area and ${currentTown?.name} (${currentTown?.distance.toFixed(1)} km away)`
                : "Nearby safety resources and emergency services"
              }
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
              className="bg-safecity-surface hover:bg-gray-700 text-safecity-text px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <FiMapPin />
              <span>{viewMode === "list" ? "Map View" : "List View"}</span>
            </button>
          </div>
        </div>
      </div>

      {isUsingNearestTown && (
        <div className="mb-6 bg-gray-500 bg-opacity-10 border border-gray-500 border-opacity-20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FiInfo className="text-blue-400 text-xl" />
            <div>
              <p className="text-white">Showing services from your area and nearest town</p>
              <p className="text-white">
                Some essential services not found locally. Displaying estimated services from {currentTown?.name} ({currentTown?.distance.toFixed(1)} km away)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for police, hospitals, safe places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-safecity-surface text-safecity-text rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-safecity-accent"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-safecity-muted text-xl" />
          </div>
          <button className="bg-safecity-surface hover:bg-gray-700 text-safecity-text px-4 py-3 rounded-xl transition-colors flex items-center space-x-2">
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-4 min-w-max">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-safecity-accent text-white"
                  : "bg-safecity-surface text-safecity-text hover:bg-gray-700"
              }`}
            >
              <span className={category.color}>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safecity-accent mx-auto mb-4"></div>
          <p className="text-safecity-muted">Loading safety services...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2 text-red-400">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {!loading && viewMode === "map" ? (
        <div className="h-96 rounded-xl overflow-hidden">
          {userLocation ? (
            <MapView
              center={[userLocation.latitude, userLocation.longitude]}
              markers={filteredServices.map((service) => ({
                lat: service.coordinates.lat,
                lng: service.coordinates.lng,
                name: service.name,
                address: service.address,
                type: service.type,
              }))}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            />
          ) : (
            <div className="bg-safecity-surface rounded-xl h-96 flex items-center justify-center text-safecity-muted border border-gray-600">
              <div className="text-center">
                <FiMapPin className="text-4xl mx-auto mb-4" />
                <p className="text-xl mb-2">Loading Map...</p>
                <p className="text-sm">Getting your location</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map(renderServiceCard)}
          </div>
        )
      )}

      {/* Empty State */}
      {!loading && filteredServices.length === 0 && (
        <div className="text-center py-12">
          <FiMapPin className="text-6xl text-safecity-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-xl text-safecity-text mb-2">No services found</h3>
          <p className="text-safecity-muted">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Emergency Quick Action */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 flex items-center justify-center">
          <FiAlertCircle className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default NearbySafetyServices;