import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different service types
const createCustomIcon = (type) => {
  const colors = {
    police: 'blue',
    hospital: 'red',
    fire: 'orange',
    all: 'green'
  };

  const color = colors[type] || 'gray';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color}; 
        width: 20px; 
        height: 20px; 
        border-radius: 50%; 
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const MapView = ({ center, markers = [], zoom = 13, style = {}, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize map - runs only once
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(center, zoom);
  }, [center, zoom]);

  // Update markers - FIXED VERSION
  useEffect(() => {
    if (!mapInstanceRef.current || !markers) return;

    console.log(`🔄 Updating map with ${markers.length} markers`);

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add new markers
    if (markers.length > 0) {
      markers.forEach((marker) => {
        try {
          const customIcon = createCustomIcon(marker.type);
          
          const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="font-weight: bold; margin: 0 0 8px 0; color: #1f2937;">${marker.name}</h3>
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">${marker.address}</p>
                ${marker.type ? `<p style="margin: 0; color: #374151; font-size: 11px; text-transform: capitalize;">${marker.type}</p>` : ''}
              </div>
            `);

          // Store marker reference
          markersRef.current.push(leafletMarker);

          // Add click event if callback provided
          if (onMarkerClick) {
            leafletMarker.on("click", () => {
              onMarkerClick(marker);
            });
          }
        } catch (error) {
          console.error("Error creating marker:", error);
        }
      });

      // Fit map to show all markers if we have multiple
      if (markers.length > 1) {
        const group = new L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
      // If only one marker, center on it and open popup
      else if (markers.length === 1) {
        setTimeout(() => {
          if (markersRef.current[0]) {
            markersRef.current[0].openPopup();
          }
        }, 500);
      }
    }

  }, [markers, onMarkerClick]); // This effect runs every time markers change

  return (
    <div 
      ref={mapRef} 
      className="w-full rounded-xl border-2 border-gray-600"
      style={{ height: style.height || '400px', ...style }}
    />
  );
};

export default MapView;