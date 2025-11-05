import React, { useEffect, useRef, useState } from "react";
import { useSafeCity } from "../../context/SafeCity";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage, FaUpload, FaTrash } from "react-icons/fa";

const MAX_IMAGES = 3;

const MyReports = () => {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [reports, setReports] = useState([]);
  const { backendUrl } = useSafeCity();
  const [loading, setLoading] = useState(false);

  const buttonRefs = useRef([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
    urgency: "",
    description: "",
    images: [],
    newImages: [],
    imagePreviews: [],
    anonymous: false,
  });

  const categories = [
    "Road Hazard",
    "StreetLight Hazard",
    "Water Leakage",
    "Public Safety Concern",
    "Garbage / Cleanliness",
  ];

  const urgencyLevels = ["High", "Medium", "Low"];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/reports/get-reports`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setReports(res.data.reports);
        }
      } catch (err) {
        toast.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    })();
  }, [backendUrl]);

  const handleReportView = (report, index) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.slice(0, MAX_IMAGES - form.images.length);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setForm((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...newFiles],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };

  const removeImageAt = (index) => {
    setForm((prev) => {
      const newPrev = [...prev.imagePreviews];
      newPrev.splice(index, 1);

      const newFiles = [...prev.newImages];
      if (newFiles[index]) newFiles.splice(index, 1);

      return { ...prev, newImages: newFiles, imagePreviews: newPrev };
    });
  };

  const handleEditView = (report) => {
    setSelectedReport(report);
    setForm({
      title: report.title,
      category: report.category,
      urgency: report.urgency,
      description: report.description,
      images: report.images || [],
      newImages: [],
      imagePreviews: report.images || [],
      anonymous: report.anonymous,
    });
    setEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("urgency", form.urgency);
      formData.append("description", form.description);
      formData.append("anonymous", form.anonymous);

      formData.append("existingImages", JSON.stringify(form.images));

      form.newImages.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.put(
        `${backendUrl}/api/reports/update/${selectedReport._id}`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Report updated successfully");
        setReports((prev) =>
          prev.map((r) => (r._id === res.data.report._id ? res.data.report : r))
        );
        setEditModal(false);
      }
    } catch (err) {
      toast.error("Failed to update report");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;

    try {
      setLoading(true);
      await axios.delete(
        `${backendUrl}/api/reports/delete/${reportToDelete._id}`,
        { withCredentials: true }
      );

      setReports((prev) => prev.filter((r) => r._id !== reportToDelete._id));
      toast.success("Report deleted!");
      setDeleteModal(false);
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      (!categoryFilter || r.category === categoryFilter) &&
      (!urgencyFilter || r.urgency === urgencyFilter) &&
      (!searchFilter ||
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
                        onClick={() => handleEditView(report)}
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

      {/*  View Modal */}
      {modalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-safecity-dark w-96 p-5 rounded-lg border border-gray-500 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-white text-lg"
            >
              ✕
            </button>

            <h2 className="text-lg text-red-500 font-bold mb-3">
              Report Details
            </h2>

            <p className="text-safecity-text">
              <b>Title:</b> {selectedReport.title}
            </p>
            <p className="text-safecity-text">
              <b>Category:</b> {selectedReport.category}
            </p>
            <p className="text-safecity-text">
              <b>Urgency:</b> {selectedReport.urgency}
            </p>
            <p className="text-safecity-text">
              <b>Description:</b> {selectedReport.description}
            </p>

            {/* ✅ Display Images */}
            {selectedReport.images?.length > 0 && (
              <div className="mt-3">
                <p className="text-safecity-text font-semibold mb-1">Images:</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedReport.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="report"
                      className="w-28 h-28 rounded object-cover border border-gray-600"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-safecity-dark p-6 rounded-lg text-center space-y-4 w-80">
            <h2 className="text-lg font-bold text-red-500">Confirm Delete</h2>
            <p className="text-safecity-muted text-sm">
              Delete this report permanently?
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-1 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-1 bg-red-700 hover:bg-red-800 text-white rounded"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 overflow-y-auto p-4">
          <div className="bg-safecity-dark rounded-lg p-5 w-[95%] max-w-2xl">
            <h2 className="text-lg font-bold text-white mb-3">Edit Report</h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 bg-safecity-surface rounded"
                required
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-2 bg-safecity-surface rounded"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="w-full p-2 bg-safecity-surface rounded"
              >
                <option value="">Select urgency</option>
                {urgencyLevels.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>

              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 bg-safecity-surface rounded"
              />

              {/*  Image Upload section fully working now */}
              <div>
                <label className="text-white">
                  Images ({form.imagePreviews.length}/{MAX_IMAGES})
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="flex gap-2 mt-2">
                  {form.imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageAt(i)}
                        className="absolute top-1 right-1 bg-black text-white rounded p-1"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex gap-2 items-center text-white">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={form.anonymous}
                  onChange={handleChange}
                />
                Anonymous Report
              </label>

              <div className="text-right">
                <button className="px-5 py-2 bg-safecity-accent text-white rounded">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;
