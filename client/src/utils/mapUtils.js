// Get nearby points (later this could use Google Places API or OpenStreetMap Overpass API)
export const getNearbyServices = async (lat, lng, type = "all") => {
  // You can replace this with real API calls later
  return [
    { name: "NYPD 1st Precinct", lat: 40.7193, lng: -74.0068, type: "police" },
    { name: "Hospital", lat: 40.7092, lng: -74.0072, type: "hospital" },
    { name: "Pharmacy", lat: 40.7054, lng: -74.013, type: "pharmacy" },
  ];
};

// Calculate distance between two points (in km)
export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
