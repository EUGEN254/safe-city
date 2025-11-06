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

const MapView = ({ center, markers = [], zoom = 13, style = {}, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

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

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Update map center and zoom when props change
    mapInstanceRef.current.setView(center, zoom);
  }, [center, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.lat, marker.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="text-safecity-dark">
            <h3 class="font-bold text-sm">${marker.name}</h3>
            <p class="text-xs">${marker.address}</p>
            ${marker.type ? `<p class="text-xs text-gray-600 capitalize">${marker.type}</p>` : ''}
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
    });

    // If only one marker, open its popup automatically
    if (markers.length === 1) {
      setTimeout(() => {
        if (markersRef.current[0]) {
          markersRef.current[0].openPopup();
        }
      }, 500);
    }
  }, [markers, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full rounded-xl"
      style={{ height: style.height || '400px', ...style }}
    />
  );
};

export default MapView;