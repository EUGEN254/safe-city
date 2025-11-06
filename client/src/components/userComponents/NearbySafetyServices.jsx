import React, { useState, useEffect } from 'react';
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
  FiShare2
} from 'react-icons/fi';

const NearbySafetyServices = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  // Mock user location (in real app, this would come from GPS)
  useEffect(() => {
    // Simulate getting user location
    setUserLocation({
      latitude: 40.7128,
      longitude: -74.0060,
      address: "New York, NY"
    });
  }, []);

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: <FiShield />, color: 'text-blue-400' },
    { id: 'police', name: 'Police Stations', icon: <FiUsers />, color: 'text-blue-500' },
    { id: 'hospital', name: 'Hospitals', icon: <FiAlertCircle />, color: 'text-red-400' },
    { id: 'fire', name: 'Fire Stations', icon: <FiShield />, color: 'text-orange-400' },
    { id: 'pharmacy', name: '24/7 Pharmacies', icon: <FiStar />, color: 'text-green-400' },
    { id: 'camera', name: 'Security Cameras', icon: <FiCamera />, color: 'text-purple-400' },
    { id: 'safehouse', name: 'Safe Places', icon: <FiMapPin />, color: 'text-teal-400' }
  ];

  const safetyServices = [
    {
      id: 1,
      name: "NYPD 1st Precinct",
      type: "police",
      address: "16 Ericsson Place, New York, NY 10013",
      distance: "0.8 mi",
      rating: 4.2,
      reviews: 124,
      phone: "+1 (212) 334-0611",
      hours: "24/7",
      coordinates: { lat: 40.7193, lng: -74.0068 },
      features: ["Emergency Response", "Community Policing", "Report Filing"],
      waitTime: "5-10 min",
      isOpen: true
    },
    {
      id: 2,
      name: "New York-Presbyterian Hospital",
      type: "hospital",
      address: "170 William St, New York, NY 10038",
      distance: "1.2 mi",
      rating: 4.5,
      reviews: 456,
      phone: "+1 (212) 312-5000",
      hours: "24/7",
      coordinates: { lat: 40.7092, lng: -74.0072 },
      features: ["Emergency Room", "Trauma Center", "Ambulance Services"],
      waitTime: "15-30 min",
      isOpen: true
    },
    {
      id: 3,
      name: "FDNY Engine 10 / Ladder 10",
      type: "fire",
      address: "124 Liberty St, New York, NY 10006",
      distance: "0.5 mi",
      rating: 4.8,
      reviews: 89,
      phone: "+1 (212) 312-5000",
      hours: "24/7",
      coordinates: { lat: 40.7095, lng: -74.0146 },
      features: ["Fire Response", "Rescue Services", "Medical First Response"],
      waitTime: "2-5 min",
      isOpen: true
    },
    {
      id: 4,
      name: "CVS Pharmacy 24/7",
      type: "pharmacy",
      address: "2 Broadway, New York, NY 10004",
      distance: "0.3 mi",
      rating: 4.0,
      reviews: 234,
      phone: "+1 (212) 344-3318",
      hours: "24/7",
      coordinates: { lat: 40.7054, lng: -74.0130 },
      features: ["Emergency Prescriptions", "First Aid", "Over-the-Counter"],
      waitTime: "0-5 min",
      isOpen: true
    },
    {
      id: 5,
      name: "Public Safety Camera - Broadway",
      type: "camera",
      address: "Broadway & Liberty St, New York, NY 10006",
      distance: "0.2 mi",
      rating: null,
      reviews: null,
      phone: null,
      hours: "24/7",
      coordinates: { lat: 40.7090, lng: -74.0115 },
      features: ["24/7 Monitoring", "High Definition", "Police Linked"],
      isOpen: true
    },
    {
      id: 6,
      name: "Community Safe Space",
      type: "safehouse",
      address: "55 Water St, New York, NY 10041",
      distance: "0.9 mi",
      rating: 4.6,
      reviews: 67,
      phone: "+1 (212) 566-7854",
      hours: "6:00 AM - 11:00 PM",
      coordinates: { lat: 40.7025, lng: -74.0085 },
      features: ["Rest Area", "Phone Charging", "Security Personnel", "First Aid"],
      isOpen: true
    }
  ];

  const filteredServices = safetyServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getServiceIcon = (type) => {
    const category = serviceCategories.find(cat => cat.id === type);
    return category ? category.icon : <FiMapPin />;
  };

  const getServiceColor = (type) => {
    const category = serviceCategories.find(cat => cat.id === type);
    return category ? category.color : 'text-gray-400';
  };

  const handleCallService = (phone) => {
    if (phone && window.confirm(`Call ${phone}?`)) {
      window.open(`tel:${phone}`);
    }
  };

  const handleGetDirections = (coordinates) => {
    // In a real app, this would open maps with directions
    const { lat, lng } = coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const renderServiceCard = (service) => (
    <div 
      key={service.id}
      className="bg-safecity-surface rounded-xl p-4 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer border border-safecity-surface hover:border-safecity-accent"
      onClick={() => setSelectedService(service)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-safecity-accent bg-opacity-20 flex items-center justify-center ${getServiceColor(service.type)}`}>
            {getServiceIcon(service.type)}
          </div>
          <div>
            <h3 className="text-safecity-text font-semibold">{service.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-safecity-muted">
              <FiMapPin className="text-xs" />
              <span>{service.distance} away</span>
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
            {service.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
        {service.waitTime && (
          <span className="text-safecity-muted">Wait: {service.waitTime}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {service.features.slice(0, 2).map((feature, index) => (
          <span key={index} className="bg-safecity-dark text-safecity-muted px-2 py-1 rounded text-xs">
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
          <div></div>
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

  const renderServiceDetail = () => (
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
            <div className={`w-12 h-12 rounded-xl bg-safecity-accent bg-opacity-20 flex items-center justify-center ${getServiceColor(selectedService.type)} text-xl`}>
              {getServiceIcon(selectedService.type)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-safecity-text">{selectedService.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-safecity-muted mt-1">
                <span>{selectedService.distance} away</span>
                <span>•</span>
                <span className={selectedService.isOpen ? "text-green-400" : "text-red-400"}>
                  {selectedService.isOpen ? 'Open Now' : 'Closed'}
                </span>
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

        {/* Map Placeholder */}
        <div className="bg-safecity-dark rounded-xl h-48 mb-6 flex items-center justify-center text-safecity-muted border border-gray-600">
          <div className="text-center">
            <FiMapPin className="text-2xl mx-auto mb-2" />
            <p>Interactive Map View</p>
            <p className="text-sm">Location: {selectedService.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-safecity-text mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-safecity-muted" />
                <span className="text-safecity-text">{selectedService.address}</span>
              </div>
              {selectedService.phone && (
                <div className="flex items-center space-x-3">
                  <FiPhone className="text-safecity-muted" />
                  <span className="text-safecity-text">{selectedService.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <FiClock className="text-safecity-muted" />
                <span className="text-safecity-text">{selectedService.hours}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-safecity-text mb-3">Service Details</h3>
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
            <h3 className="text-lg font-semibold text-safecity-text mb-3">Ratings & Reviews</h3>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-safecity-text">{selectedService.rating}</div>
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <FiStar 
                      key={star}
                      className={`text-sm ${
                        star <= Math.floor(selectedService.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600'
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
          {selectedService.phone && (
            <button
              onClick={() => handleCallService(selectedService.phone)}
              className="flex-1 bg-safecity-accent hover:bg-safecity-accent-hover text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <FiPhone />
              <span>Call Now</span>
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
      </div>
    </div>
  );

  if (selectedService) {
    return renderServiceDetail();
  }

  return (
    <div className="min-h-screen bg-safecity-dark p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-safecity-text">Safety Services</h1>
            <p className="text-safecity-muted">
              Nearby safety resources and emergency services
              {userLocation && ` near ${userLocation.address}`}
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              className="bg-safecity-surface hover:bg-gray-700 text-safecity-text px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <FiMapPin />
              <span>{viewMode === 'list' ? 'Map View' : 'List View'}</span>
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
              placeholder="Search for police, hospitals, pharmacies..."
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
                  ? 'bg-safecity-accent text-white'
                  : 'bg-safecity-surface text-safecity-text hover:bg-gray-700'
              }`}
            >
              <span className={category.color}>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map(renderServiceCard)}
        </div>
      ) : (
        <div className="bg-safecity-surface rounded-xl h-96 flex items-center justify-center text-safecity-muted border border-gray-600">
          <div className="text-center">
            <FiMapPin className="text-4xl mx-auto mb-4" />
            <p className="text-xl mb-2">Interactive Map View</p>
            <p className="text-sm">Showing {filteredServices.length} safety services in your area</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <FiMapPin className="text-6xl text-safecity-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-xl text-safecity-text mb-2">No services found</h3>
          <p className="text-safecity-muted">Try adjusting your search or filter criteria</p>
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