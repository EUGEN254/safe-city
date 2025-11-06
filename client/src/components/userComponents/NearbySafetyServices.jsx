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
  FiLoader,
  FiRefreshCw,
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
  const [searchRadius, setSearchRadius] = useState(50000); // Increased to 50km
  const [isExtendingSearch, setIsExtendingSearch] = useState(false);

  const serviceCategories = [
    {
      id: "all",
      name: "All Services",
      icon: <FiShield />,
      color: "text-blue-400",
    },
    {
      id: "police",
      name: "Police Stations",
      icon: <FiUsers />,
      color: "text-blue-500",
    },
    {
      id: "hospital",
      name: "Hospitals",
      icon: <FiAlertCircle />,
      color: "text-red-400",
    },
    {
      id: "fire",
      name: "Fire Stations",
      icon: <FiShield />,
      color: "text-orange-400",
    },
    // REMOVED: Pharmacy and Safe Places categories
  ];

  // Expanded Kenyan towns for better fallback coverage
  const kenyanTowns = [
    { name: "Nairobi", lat: -1.286389, lng: 36.817223 },
    { name: "Mombasa", lat: -4.0435, lng: 39.6682 },
    { name: "Kisumu", lat: -0.1022, lng: 34.7617 },
    { name: "Nakuru", lat: -0.3031, lng: 36.08 },
    { name: "Eldoret", lat: 0.5143, lng: 35.2698 },
    { name: "Meru", lat: 0.05, lng: 37.65 },
    { name: "Thika", lat: -1.0395, lng: 37.0902 },
    { name: "Malindi", lat: -3.2175, lng: 40.1191 },
    { name: "Kitale", lat: 1.0167, lng: 35.0 },
    { name: "Garissa", lat: -0.4569, lng: 39.6583 },
    { name: "Kakamega", lat: 0.2827, lng: 34.7519 },
    { name: "Lodwar", lat: 3.1167, lng: 35.6 },
    { name: "Marsabit", lat: 2.3333, lng: 37.9833 },
    { name: "Isiolo", lat: 0.35, lng: 37.5833 },
    { name: "Nyeri", lat: -0.4167, lng: 36.95 },
    { name: "Embu", lat: -0.5333, lng: 37.45 },
    { name: "Machakos", lat: -1.5167, lng: 37.2667 },
    { name: "Narok", lat: -1.0833, lng: 35.8667 },
  ];

  useEffect(() => {
    fetchLocationAndServices();
  }, []);

  const fetchLocationAndServices = async () => {
    try {
      setLoading(true);
      setError(null);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            console.log("User location found:", latitude, longitude);

            // Try Overpass API first
            let services = await fetchOverpassServices(latitude, longitude, searchRadius);
            
            console.log(`Overpass returned ${services.length} services`);

            // If no services found, extend search radius
            if (services.length === 0) {
              console.log("No services found with current radius, extending search...");
              services = await fetchOverpassServices(latitude, longitude, 100000); // 100km
              setIsExtendingSearch(true);
            }

            // If still no services, use fallback data
            if (services.length === 0) {
              services = await getFallbackServices(latitude, longitude);
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
            timeout: 20000, // Increased timeout
            maximumAge: 60000,
          }
        );
      } else {
        handleLocationError();
      }
    } catch (error) {
      console.error("Error in fetchLocationAndServices:", error);
      setError("Failed to load safety services. Please try again.");
      setLoading(false);
    }
  };

  const fetchOverpassServices = async (lat, lng, radius = 50000) => {
    try {
      // Updated query - REMOVED pharmacy and safe places
      const query = `
        [out:json][timeout:45];
        (
          node["amenity"~"police|hospital|clinic|fire_station"](around:${radius},${lat},${lng});
          way["amenity"~"police|hospital|clinic|fire_station"](around:${radius},${lat},${lng});
          node["building"~"hospital|clinic"](around:${radius},${lat},${lng});
          node["emergency"~"yes"](around:${radius},${lat},${lng});
        );
        out center;
      `;

      // Longer delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn("Overpass API rate limit exceeded");
          return [];
        }
        console.warn(`Overpass API error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      
      if (!data.elements || data.elements.length === 0) {
        console.log("No elements found in Overpass response");
        return [];
      }

      console.log(`Found ${data.elements} elements from Overpass`);

      const services = data.elements
        .map((element, index) => {
          
          // Get coordinates
          let coords = { lat: 0, lng: 0 };
          if (element.type === "node") {
            coords = { lat: element.lat, lng: element.lon };
          } else if (element.center) {
            coords = { lat: element.center.lat, lng: element.center.lon };
          } else {
            return null;
          }

          const serviceType = element.tags?.amenity || element.tags?.building || element.tags?.emergency || "unknown";
          const mappedType = mapServiceType(serviceType);

          // REMOVED: Filter out pharmacy and safehouse types
          if (mappedType === "unknown" || mappedType === "pharmacy" || mappedType === "safehouse") return null;

          const name = element.tags?.name || generateServiceName(mappedType);
          const distance = calculateDistance(lat, lng, coords.lat, coords.lng);

          return {
            id: element.id || `service-${index}-${Date.now()}`,
            name: name,
            type: mappedType,
            address: generateAddress(element.tags),
            coordinates: coords,
            distance: distance,
            phone: element.tags?.phone || null,
            hours: extractOpeningHours(mappedType, element.tags),
            features: extractFeatures(mappedType),
            waitTime: estimateWaitTime(mappedType),
            isOpen: true,
            isRealData: true,
          };
        })
        .filter(service => service !== null);

      return services;
    } catch (error) {
      console.error("Error fetching from Overpass:", error);
      return [];
    }
  };

  const getFallbackServices = async (userLat, userLng) => {
    // Find nearest town
    const nearestTown = findNearestTown(userLat, userLng);
    console.log("Using fallback data for:", nearestTown.name);
    
    // Generate realistic services based on the nearest town
    return generateTownServices(nearestTown, userLat, userLng);
  };

  const findNearestTown = (userLat, userLng) => {
    let nearestTown = kenyanTowns[0];
    let shortestDistance = calculateDistanceInKm(userLat, userLng, nearestTown.lat, nearestTown.lng);

    for (let i = 1; i < kenyanTowns.length; i++) {
      const town = kenyanTowns[i];
      const distance = calculateDistanceInKm(userLat, userLng, town.lat, town.lng);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestTown = town;
      }
    }

    return {
      ...nearestTown,
      distance: shortestDistance,
    };
  };

  const generateTownServices = (town, userLat, userLng) => {
    // Generate services for ANY Kenyan town - REMOVED pharmacy and safe places
    const baseServices = [
      {
        id: 1,
        name: `${town.name} Police Station`,
        type: "police",
        address: `Main Police Station, ${town.name}`,
        coordinates: { 
          lat: town.lat + (Math.random() * 0.02 - 0.01), 
          lng: town.lng + (Math.random() * 0.02 - 0.01) 
        },
        distance: calculateDistance(userLat, userLng, town.lat, town.lng),
        phone: null,
        hours: "24/7",
        features: ["Emergency Response", "Community Policing", "Report Filing"],
        waitTime: "5-15 min",
        isOpen: true,
        isRealData: false,
        isFallback: true,
      },
      {
        id: 2,
        name: `${town.name} District Hospital`,
        type: "hospital",
        address: `Hospital Road, ${town.name}`,
        coordinates: { 
          lat: town.lat + (Math.random() * 0.02 - 0.01), 
          lng: town.lng + (Math.random() * 0.02 - 0.01) 
        },
        distance: calculateDistance(userLat, userLng, town.lat, town.lng),
        phone: null,
        hours: "24/7",
        features: ["Emergency Room", "Ambulance Services", "Outpatient Care"],
        waitTime: "15-45 min",
        isOpen: true,
        isRealData: false,
        isFallback: true,
      },
      {
        id: 3,
        name: `${town.name} Fire Station`,
        type: "fire",
        address: `Station Road, ${town.name}`,
        coordinates: { 
          lat: town.lat + (Math.random() * 0.02 - 0.01), 
          lng: town.lng + (Math.random() * 0.02 - 0.01) 
        },
        distance: calculateDistance(userLat, userLng, town.lat, town.lng),
        phone: null,
        hours: "24/7",
        features: ["Fire Response", "Rescue Services", "Emergency"],
        waitTime: "Immediate",
        isOpen: true,
        isRealData: false,
        isFallback: true,
      }
      // REMOVED: Pharmacy and Safe Places services
    ];

    return baseServices;
  };

  const mapServiceType = (amenityType) => {
    const mapping = {
      police: "police",
      hospital: "hospital",
      clinic: "hospital",
      fire_station: "fire",
    };
    // REMOVED: pharmacy and safehouse mappings
    return mapping[amenityType] || "unknown";
  };

  const generateServiceName = (type) => {
    const names = {
      police: "Police Station",
      hospital: "Medical Facility",
      fire: "Fire Station",
    };
    // REMOVED: pharmacy and safehouse names
    return names[type] || "Service";
  };

  const generateAddress = (tags) => {
    if (tags["addr:full"]) return tags["addr:full"];
    
    const addressParts = [
      tags["addr:housenumber"],
      tags["addr:street"],
      tags["addr:city"]
    ].filter(part => part && part.trim() !== "");
    
    return addressParts.length > 0 ? addressParts.join(", ") : "Address not specified";
  };

  const extractOpeningHours = (type, tags) => {
    if (tags.opening_hours) return tags.opening_hours;
    
    const defaultHours = {
      police: "24/7",
      hospital: "24/7",
      fire: "24/7",
    };
    // REMOVED: pharmacy and safehouse hours
    
    return defaultHours[type] || "Hours not specified";
  };

  const extractFeatures = (type) => {
    const features = {
      police: ["Law Enforcement", "Emergency Response", "Public Safety"],
      hospital: ["Medical Care", "Emergency Services", "Healthcare"],
      fire: ["Fire Response", "Rescue Services", "Emergency"],
    };
    // REMOVED: pharmacy and safehouse features
    return features[type] || ["Public Service"];
  };

  const estimateWaitTime = (type) => {
    const waitTimes = {
      hospital: "15-45 min",
      police: "5-15 min",
      fire: "Immediate",
    };
    // REMOVED: pharmacy and safehouse wait times
    return waitTimes[type] || "Varies";
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
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  };

  const handleLocationError = () => {
    setError("Unable to access your location. Using default location (Nairobi).");
    const defaultLocation = { latitude: -1.286389, longitude: 36.817223 };
    setUserLocation(defaultLocation);
    const services = generateTownServices(
      { name: "Nairobi", lat: -1.286389, lng: 36.817223, distance: 0 },
      defaultLocation.latitude,
      defaultLocation.longitude
    );
    setSafetyServices(services);
    setLoading(false);
  };

  const retrySearch = async () => {
    await fetchLocationAndServices();
  };

  const extendSearchRadius = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    setIsExtendingSearch(true);
    const extendedRadius = 100000; // 100km
    const services = await fetchOverpassServices(
      userLocation.latitude, 
      userLocation.longitude, 
      extendedRadius
    );
    setSafetyServices(services);
    setLoading(false);
  };

  const filteredServices = safetyServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || service.type === selectedCategory;

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
              {service.isFallback && (
                <span className="text-xs text-yellow-400">(General Location)</span>
              )}
            </div>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
          service.isRealData 
            ? "bg-green-500 bg-opacity-20 text-green-400" 
            : "bg-yellow-500 bg-opacity-20 text-yellow-400"
        }`}>
          <span>{service.isRealData ? "Verified" : "Estimated"}</span>
        </div>
      </div>

      <p className="text-safecity-muted text-sm mb-3">{service.address}</p>

      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center space-x-2">
          <FiClock className="text-safecity-muted" />
          <span className={service.isOpen ? "text-green-400" : "text-red-400"}>
            {service.isOpen ? "Open" : "Closed"}
          </span>
        </div>
        {service.waitTime && (
          <span className="text-safecity-muted">Wait: {service.waitTime}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {service.features.slice(0, 3).map((feature, index) => (
          <span
            key={index}
            className="bg-safecity-dark text-safecity-muted px-2 py-1 rounded text-xs"
          >
            {feature}
          </span>
        ))}
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
              Find emergency services anywhere in Kenya
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

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for police, hospitals, fire stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-safecity-surface text-safecity-text rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-safecity-accent"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-safecity-muted text-xl" />
          </div>
          <button 
            onClick={retrySearch}
            className="bg-safecity-accent hover:bg-safecity-accent-hover text-white px-4 py-3 rounded-xl transition-colors flex items-center space-x-2"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Category Filter - NOW ONLY 4 CATEGORIES */}
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

      {/* Extended Search Notice */}
      {isExtendingSearch && (
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-400">
              <FiInfo />
              <span>Extended search to 100km radius to find more services</span>
            </div>
            <button
              onClick={extendSearchRadius}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Search Wider
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safecity-accent mx-auto mb-4"></div>
          <p className="text-safecity-muted">Finding safety services near you...</p>
          <p className="text-safecity-muted text-sm mt-2">
            Searching within {searchRadius / 1000}km radius
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-yellow-400">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
            <button
              onClick={retrySearch}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
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
              style={{ height: "100%", width: "100%" }}
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
          <p className="text-safecity-muted mb-4">
            We couldn't find any services in your area. Try extending the search radius.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={retrySearch}
              className="bg-safecity-accent hover:bg-safecity-accent-hover text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={extendSearchRadius}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Search 100km Radius
            </button>
          </div>
        </div>
      )}

      {/* Info Footer */}
      {!loading && filteredServices.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-safecity-muted text-sm">
            Showing {filteredServices.length} services • 
            {safetyServices.some(s => s.isRealData) ? " Some verified locations" : " Estimated locations"} •
            Search radius: {searchRadius / 1000}km
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