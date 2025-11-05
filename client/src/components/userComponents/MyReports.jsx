import React, { useEffect, useRef, useState } from "react";
import { useSafeCity } from "../../context/SafeCity";
import axios from "axios";
import { toast } from "react-toastify";

const MyReports = () => {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [reports, setReports] = useState([]);
  const { backendUrl } = useSafeCity();
  const [loading, setLoading] = useState(false);
  const buttonRefs = useRef([]);

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

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/reports/get-reports`,
          {
            withCredentials: true,
          }
        );
        if (!response.data.success) {
          toast.error(response.data.message);
        } else {
          setReports(response.data.reports || []);
        }
      } catch (error) {
        toast.error(error.message || "Error fetching reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [backendUrl]);

  // Handle View
  const handleReportView = (report, index) => {
    if (!report) return;

    const button = buttonRefs.current[index];
    if (button) {
      setModalPosition({
        top: window.innerHeight / 2 - 200, // half of modal height (~200px)
        left: window.innerWidth / 2 - 160, // half of modal width (320px)
      });

      setSelectedReport(report);
      setModalOpen(true);
    }
  };

  const handleEditView = (report, index) => {
    console.log("Edit report", report, index);
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;

    try {
      setLoading(true);

      const response = await axios.delete(
        `${backendUrl}/api/reports/delete/${reportToDelete._id}`,
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(response.data.message);

      setReports((prev) => prev.filter((r) => r._id !== reportToDelete._id));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  // Filter reports
  const filteredReports = reports.filter(
    (r) =>
      (categoryFilter === "" || r.category === categoryFilter) &&
      (urgencyFilter === "" || r.urgency === urgencyFilter) &&
      (searchFilter === "" ||
        r.description.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-safecity-text">My Reports</h2>
      </div>

      {/* Filters */}
      <div className="rounded-xl shadow-md bg-safecity-surface p-3 space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border bg-safecity-dark border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-safecity-accent w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="border bg-safecity-dark border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-safecity-accent w-full sm:w-auto"
          >
            <option value="">All Urgency</option>
            {urgencyLevels.map((urgency) => (
              <option key={urgency.id} value={urgency.label}>
                {urgency.label} - {urgency.description}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by description"
            onChange={(e) => setSearchFilter(e.target.value)}
            className="flex-1 py-2 px-3 border bg-safecity-dark border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="border border-gray-300 rounded-lg overflow-x-auto">
        <div className="overflow-y-auto max-h-96 scrollbar-thin">
          <table className="w-full min-w-[600px]">
            <thead className="sticky top-0 bg-safecity-dark z-20">
              <tr className="border-b border-gray-300">
                <th className="p-3 text-left text-sm font-semibold text-safecity-text">
                  No
                </th>
                <th className="p-3 text-left text-sm font-semibold text-safecity-text">
                  Title
                </th>
                <th className="p-3 text-left text-sm font-semibold text-safecity-text">
                  Category
                </th>
                <th className="p-3 text-left text-sm font-semibold text-safecity-text">
                  Urgency
                </th>
                <th className="p-3 text-left text-sm font-semibold text-safecity-text">
                  Reporter
                </th>
                <th className="p-3 text-left text-sm font-semibold text-safecity-text">
                  Created On
                </th>
                <th className="p-3 text-left text-sm font-semibold text-safecity-text">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-safecity-dark divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-safecity-muted"
                  >
                    Loading reports...
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr key={index} className="hover:bg-safecity-surface">
                    <td className="p-3 text-sm text-safecity-text">
                      {index + 1}
                    </td>
                    <td className="p-3 text-sm text-safecity-text">
                      {report.title}
                    </td>
                    <td className="p-3 text-sm text-safecity-text">
                      {report.category}
                    </td>
                    <td className="p-3 text-sm text-safecity-text">
                      {report.urgency}
                    </td>
                    <td className="p-3 text-sm text-safecity-text">
                      {report.anonymous ? (
                        <span className="italic text-safecity-muted">
                          Anonymous
                        </span>
                      ) : (
                        <div className="flex flex-col">
                          <span>{report.reporter?.fullname}</span>
                          <span className="text-safecity-muted text-xs">
                            {report.reporter?.email}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="p-3 text-sm text-safecity-text">
                      {new Date(
                        report.DateCreated || report.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="flex gap-2 p-3">
                      <button
                        ref={(el) => (buttonRefs.current[index] = el)}
                        onClick={() => handleReportView(report, index)}
                        className="py-1 px-3 rounded-lg bg-green-500 text-white hover:bg-green-600"
                      >
                        View
                      </button>
                      <button
                        ref={(el) => (buttonRefs.current[index] = el)}
                        onClick={() => handleEditView(report, index)}
                        className="py-1 px-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setReportToDelete(report);
                          setDeleteModal(true);
                        }}
                        className="py-1 px-3 rounded-lg bg-safecity-accent text-white hover:bg-safecity-accent-hover"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-5 text-safecity-muted"
                  >
                    No reports found for selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {modalOpen && selectedReport && (
        <div
          className="fixed z-50 bg-safecity-dark rounded-lg shadow-2xl border border-gray-300 w-80 max-w-sm p-4 animate-fade-in"
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            transform: "translate(0, 0)",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-lg font-bold text-red-800 mb-3 border-b pb-2">
            Report Details
          </h2>

          <div className="space-y-4 text-white/50 text-sm">
            <div>
              <span className="font-semibold">Title:</span>{" "}
              {selectedReport.title}
            </div>
            <div>
              <span className="font-semibold">Category:</span>{" "}
              {selectedReport.category}
            </div>
            <div>
              <span className="font-semibold">Urgency:</span>{" "}
              {selectedReport.urgency}
            </div>
            <div>
              <span className="font-semibold">Description:</span>{" "}
              {selectedReport.description}
            </div>
            <div>
              <span className="font-semibold">Images:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedReport.images && selectedReport.images.length > 0 ? (
                  selectedReport.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="report"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))
                ) : (
                  <span className="text-safecity-muted">No images</span>
                )}
              </div>
            </div>
          </div>

          {/* Close button at bottom */}
          <div className="flex justify-end mt-3 pt-2 border-t">
            <button
              onClick={() => setModalOpen(false)}
              className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-safecity-dark rounded-lg p-6 w-80 text-center space-y-4 border border-gray-500">
            <h2 className="text-lg font-bold text-red-600">Confirm Delete</h2>
            <p className="text-safecity-muted text-sm">
              Are you sure you want to delete this report?
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className={`px-4 py-1 text-white rounded transition-colors
                  ${
                    loading
                      ? "bg-red-600 cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-700"
                  }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;
