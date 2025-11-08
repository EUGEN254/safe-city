// Report.jsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaImage, FaUpload, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useSafeCity } from "../../context/SafeCity";
import { toast } from "react-toastify";

// import leaflet marker images
import markerIcons2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

// Fix for default markers in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcons2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MAX_IMAGES = 3;

const Report = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);

  // states
  const [chosenLocation, setChosenLocation] = useState(null);
  const { backendUrl, addReport } = useSafeCity();
  const [isLoading, setIsLoading] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  const [form, setForm] = useState({
    category: "",
    urgency: "",
    report: "",
    description: "",
    images: [],
    imagePreviews: [],
    anonymous: false,
  });

  // Dummy data for categories & urgency
  const categories = [
    { id: 1, name: "Road Hazard" },
    { id: 2, name: "StreetLight Hazard" },
    { id: 3, name: "Water Leakage" },
    { id: 4, name: "Public Safety Concern" },
    { id: 5, name: "Garbage / Cleanliness" },
  ];

  const urgencyLevels = [
    { id: 1, label: "High", description: "Emergency situation" },
    { id: 2, label: "Medium", description: "Needs attention soon" },
    { id: 3, label: "Low", description: "Minor issue" },
  ];

  // Safe location handler
  const handleLocationFound = (e) => {
    try {
      const { lat, lng } = e.latlng;
      setChosenLocation({ lat, lng });

      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
          mapRef.current
        );
        markerRef.current.on("dragend", (ev) => {
          const { lat: nlat, lng: nlng } = ev.target.getLatLng();
          setChosenLocation({ lat: nlat, lng: nlng });
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }
    } catch (error) {
      console.error("Error handling location found:", error);
      toast.error("Error setting location on map");
    }
  };

  // Safe location error handler
  const handleLocationError = () => {
    toast.warning(
      "Location access denied or unavailable. Please choose location manually."
    );
    // Set a default view if location fails
    if (mapRef.current && !chosenLocation) {
      try {
        mapRef.current.setView([0, 0], 2);
      } catch (error) {
        console.error("Error setting default view:", error);
      }
    }
  };

  // Initialize map safely
  const initializeMap = () => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [0, 0],
        zoom: 2,
        attributionControl: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Set up event listeners
      mapRef.current.on("locationfound", handleLocationFound);
      mapRef.current.on("locationerror", handleLocationError);

      setMapInitialized(true);
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Failed to initialize map");
    }
  };

  // Initialize map on component mount
  useEffect(() => {
    initializeMap();

    return () => {
      // Cleanup function
      if (mapRef.current) {
        try {
          mapRef.current.off("locationfound", handleLocationFound);
          mapRef.current.off("locationerror", handleLocationError);
          mapRef.current.remove();
          mapRef.current = null;
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      }
    };
  }, []);

  // Invalidate map size after initialization and when container is visible
  useEffect(() => {
    if (mapRef.current && mapInitialized) {
      const timeoutId = setTimeout(() => {
        try {
          mapRef.current.invalidateSize();

          // Try to locate user after map is properly sized
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.locate({
                setView: true,
                maxZoom: 16,
                timeout: 10000, // 10 second timeout
              });
            }
          }, 500);
        } catch (error) {
          console.error("Error invalidating map size:", error);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [mapInitialized]);

  // Manual location selection via map click
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;

    const onMapClick = (e) => {
      try {
        const { lat, lng } = e.latlng;
        setChosenLocation({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
            mapRef.current
          );
          markerRef.current.on("dragend", (ev) => {
            const { lat: nlat, lng: nlng } = ev.target.getLatLng();
            setChosenLocation({ lat: nlat, lng: nlng });
          });
        }
      } catch (error) {
        console.error("Error handling map click:", error);
        toast.error("Error selecting location on map");
      }
    };

    mapRef.current.on("click", onMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", onMapClick);
      }
    };
  }, [mapInitialized]);

  // Use current location button handler
  const handleUseCurrentLocation = () => {
    if (!mapRef.current) {
      toast.error("Map not ready yet");
      return;
    }

    try {
      mapRef.current.locate({
        setView: true,
        maxZoom: 16,
        timeout: 10000,
      });
      toast.info("Locating your position...");
    } catch (error) {
      console.error("Error locating position:", error);
      toast.error("Failed to get current location");
    }
  };

  // Generic form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Image upload (multiple)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newFiles = [...form.images, ...files].slice(0, MAX_IMAGES);
    if (newFiles.length > MAX_IMAGES) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    try {
      // create previews, release previous object URLs
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f));

      // revoke old previews to avoid memory leaks
      form.imagePreviews.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error revoking object URL:", error);
        }
      });

      setForm((prev) => ({
        ...prev,
        images: newFiles,
        imagePreviews: newPreviews,
      }));
    } catch (error) {
      console.error("Error handling image upload:", error);
      toast.error("Error uploading images");
    }
  };

  // drag & drop (allow multiple)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const droppedFiles = Array.from(e.dataTransfer.files || []).filter((f) =>
        f.type.startsWith("image/")
      );
      if (!droppedFiles.length) return;

      const combined = [...form.images, ...droppedFiles].slice(0, MAX_IMAGES);
      if (combined.length > MAX_IMAGES) {
        toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
        return;
      }

      const previews = combined.map((f) => URL.createObjectURL(f));

      // Revoke old previews
      form.imagePreviews.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error revoking object URL:", error);
        }
      });

      setForm((prev) => ({
        ...prev,
        images: combined,
        imagePreviews: previews,
      }));
    } catch (error) {
      console.error("Error handling drop:", error);
      toast.error("Error processing dropped files");
    }
  };

  // remove one image by index
  const removeImageAt = (index) => {
    try {
      const newImages = form.images.filter((_, i) => i !== index);
      // revoke the object URL being removed
      if (form.imagePreviews[index]) {
        URL.revokeObjectURL(form.imagePreviews[index]);
      }
      const newPreviews = form.imagePreviews.filter((_, i) => i !== index);
      setForm((prev) => ({
        ...prev,
        images: newImages,
        imagePreviews: newPreviews,
      }));
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error removing image");
    }
  };

  // cleanup previews when component unmounts
  useEffect(() => {
    return () => {
      form.imagePreviews.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error revoking object URL during cleanup:", error);
        }
      });
    };
  }, []);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validations
    if (!form.report?.trim()) {
      toast.error("Please enter a report title.");
      return;
    }
    if (!form.description?.trim()) {
      toast.error("Please add a description.");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category.");
      return;
    }
    if (!form.urgency) {
      toast.error("Please select urgency level.");
      return;
    }
    if (!chosenLocation) {
      toast.error("Please select a location on the map.");
      return;
    }

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("category", form.category);
      fd.append("urgency", form.urgency);
      fd.append("title", form.report);
      fd.append("description", form.description);
      fd.append("anonymous", String(form.anonymous));
      fd.append("latitude", String(chosenLocation.lat));
      fd.append("longitude", String(chosenLocation.lng));

      // append images
      form.images.forEach((file) => {
        fd.append("images", file);
      });

      const response = await axios.post(
        `${backendUrl}/api/reports/add-report`,
        fd,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000, // 30 second timeout
        }
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to submit report");
      }

      // add to local context if provided
      if (typeof addReport === "function") {
        addReport(response.data.report);
      }

      toast.success(response.data.message || "Report submitted successfully!");

      // reset form
      form.imagePreviews.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error revoking object URL during reset:", error);
        }
      });

      setForm({
        category: "",
        urgency: "",
        report: "",
        description: "",
        images: [],
        imagePreviews: [],
        anonymous: false,
      });
      setChosenLocation(null);

      // reset marker
      if (markerRef.current) {
        try {
          mapRef.current.removeLayer(markerRef.current);
          markerRef.current = null;
        } catch (error) {
          console.error("Error removing marker:", error);
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Submission failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-safecity-text">
        Add Safety Report
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MAP */}
        <div className="bg-safecity-surface rounded-lg overflow-hidden">
          <div className="p-3 border-b border-opacity-10 text-safecity-muted">
            Tap the map to choose location or drag the marker.
            {!mapInitialized && (
              <span className="text-yellow-500 ml-2">(Loading map...)</span>
            )}
          </div>
          <div
            id="live-map"
            ref={mapContainerRef}
            style={{ height: 320, width: "100%" }}
          />
          <div className="p-3 flex items-center justify-between">
            <div className="text-sm text-safecity-muted">
              {chosenLocation
                ? `Selected: ${chosenLocation.lat.toFixed(
                    5
                  )}, ${chosenLocation.lng.toFixed(5)}`
                : "No location selected"}
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={!mapInitialized}
              className="px-3 py-1 rounded bg-safecity-accent hover:bg-safecity-accent-hover disabled:bg-gray-500 text-white text-sm transition-colors"
            >
              {mapInitialized ? "Use Current Location" : "Map Loading..."}
            </button>
          </div>
        </div>

        {/* ROW: title + category + urgency */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="block text-safecity-muted mb-1" htmlFor="report">
              Report Title *
            </label>
            <input
              id="report"
              name="report"
              value={form.report}
              onChange={handleChange}
              placeholder="e.g., Broken streetlight on 4th Ave"
              className="w-full px-3 py-2 rounded bg-safecity-dark border border-opacity-10 text-safecity-text focus:outline-none focus:ring-2 focus:ring-safecity-accent"
              required
            />
          </div>

          <div>
            <label
              className="block text-safecity-muted mb-1"
              htmlFor="category"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-safecity-dark border text-safecity-text focus:outline-none focus:ring-2 focus:ring-safecity-accent"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-safecity-muted mb-1" htmlFor="urgency">
              Urgency *
            </label>
            <select
              id="urgency"
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-safecity-dark border text-safecity-text focus:outline-none focus:ring-2 focus:ring-safecity-accent"
              required
            >
              <option value="">Select Urgency</option>
              {urgencyLevels.map((u) => (
                <option key={u.id} value={u.label}>
                  {u.label} — {u.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* description */}
        <div>
          <label
            className="block text-safecity-muted mb-1"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue, any nearby landmarks, time it occurred, etc."
            rows={5}
            className="w-full px-3 py-2 rounded bg-safecity-dark border text-safecity-text focus:outline-none focus:ring-2 focus:ring-safecity-accent"
            required
          />
        </div>

        {/* image upload */}
        <div className="bg-safecity-surface p-3 rounded">
          <label className="flex items-center gap-2 text-safecity-muted mb-2">
            <FaImage /> Images (optional) — up to {MAX_IMAGES}
          </label>

          <div
            className="border-dashed border-2 border-opacity-10 rounded p-4 flex flex-col md:flex-row gap-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* preview area */}
            <div className="flex-1 grid grid-cols-3 gap-3 items-start">
              {form.imagePreviews.length > 0 ? (
                form.imagePreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative rounded overflow-hidden bg-gray-800"
                    style={{ minHeight: 80 }}
                  >
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="object-cover w-full h-24 block"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageAt(idx)}
                      className="absolute top-1 right-1 bg-black/50 p-1 rounded text-white hover:bg-black/70 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-safecity-muted text-center py-4">
                  No images selected. You can click the upload area or drag
                  images here.
                </div>
              )}
            </div>

            {/* upload controls */}
            <div className="flex-shrink-0 w-full md:w-48 flex flex-col gap-2 items-center justify-center">
              <input
                id="report-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={form.images.length >= MAX_IMAGES}
              />
              <label
                htmlFor="report-images"
                className={`w-full cursor-pointer rounded px-3 py-2 text-center border transition ${
                  form.images.length >= MAX_IMAGES
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-safecity-dark hover:bg-safecity-accent-hover"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <FaUpload />
                  <span className="text-sm text-safecity-text">
                    {form.images.length >= MAX_IMAGES
                      ? "Max reached"
                      : "Click to upload"}
                  </span>
                  <span className="text-xs text-safecity-muted">
                    PNG, JPG, JPEG up to 4MB
                  </span>
                </div>
              </label>
              <div className="text-xs text-safecity-muted mt-1">
                {form.images.length}/{MAX_IMAGES} selected
              </div>
            </div>
          </div>
        </div>

        {/* anonymous toggle + submit */}
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-safecity-muted cursor-pointer">
            <input
              type="checkbox"
              name="anonymous"
              checked={form.anonymous}
              onChange={handleChange}
              className="accent-safecity-accent"
            />
            Report anonymously
          </label>

          <div>
            <button
              type="submit"
              disabled={isLoading || !chosenLocation}
              className="px-6 py-2 rounded bg-safecity-accent hover:bg-safecity-accent-hover disabled:bg-gray-500 text-white font-semibold transition-colors"
            >
              {isLoading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Report;
