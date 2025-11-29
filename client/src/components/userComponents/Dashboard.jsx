import React, { useState, useEffect } from "react";
import { useSafeCity } from "../../context/SafeCity.jsx";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user, backendUrl } = useSafeCity();
  const [dashboardData, setDashboardData] = useState({
    reports: [],
    messages: [],
    notifications: [],
    stats: {},
  });
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts matching your theme
  const CHART_COLORS = {
    accent: "#e63946",
    surface: "#2c3148",
    dark: "#1b1f2f",
    high: "#e63946",
    medium: "#f4a261",
    low: "#2a9d8f",
  };

  // Fetch dashboard data from your backend API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${backendUrl}/api/dashboard/stats`, {
          params: { timeRange },
          withCredentials: true,
        });

        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange, backendUrl]);

  // Format data for charts based on API response
  const formatChartData = () => {
    const { stats, reports = [] } = dashboardData;

    // Weekly trend data
    const weeklyTrend = stats.weeklyTrend || [
      { day: "Mon", reports: 0, messages: 0 },
      { day: "Tue", reports: 0, messages: 0 },
      { day: "Wed", reports: 0, messages: 0 },
      { day: "Thu", reports: 0, messages: 0 },
      { day: "Fri", reports: 0, messages: 0 },
      { day: "Sat", reports: 0, messages: 0 },
      { day: "Sun", reports: 0, messages: 0 },
    ];

    // Category distribution
    const categories = stats.categories || [
      { name: "Theft", value: 0 },
      { name: "Assault", value: 0 },
      { name: "Vandalism", value: 0 },
      { name: "Other", value: 0 },
    ];

    // Urgency distribution
    const urgencyDistribution = stats.urgencyDistribution || [
      { name: "High", value: 0 },
      { name: "Medium", value: 0 },
      { name: "Low", value: 0 },
    ];

    return {
      weeklyTrend,
      categories,
      urgencyDistribution,
      stats: {
        totalReports: stats.totalReports || 0,
        reportsThisWeek: stats.reportsThisWeek || 0,
        highUrgencyReports: stats.highUrgencyReports || 0,
        messagesCount: stats.messagesCount || 0,
        responseRate: stats.responseRate || "0%",
      },
    };
  };

  const { weeklyTrend, categories, urgencyDistribution, stats } =
    formatChartData();

  if (loading) {
    return (
      <div className="min-h-screen bg-safecity-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-safecity-accent rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-safecity-accent rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-safecity-accent rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-safecity-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-safecity-dark flex items-center justify-center">
        <div className="text-safecity-accent text-center">
          <p className="text-xl mb-2">Error loading dashboard</p>
          <p className="text-safecity-muted">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-safecity-accent text-white rounded-lg hover:bg-safecity-accent-hover"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-safecity-dark p-6 outlet-scroll">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-safecity-text">
          Welcome back, {user?.fullname || "User"}
        </h1>
        <p className="text-safecity-muted">
          Here's what's happening in your community
        </p>

        {/* Time Range Filter */}
        <div className="flex gap-2 mt-4">
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === range
                  ? "bg-safecity-accent text-white"
                  : "bg-safecity-surface text-safecity-muted hover:bg-safecity-accent-hover"
              }`}
            >
              This {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Reports"
          value={stats.totalReports}
          change="+12%" // You can calculate this from your API data
          color={CHART_COLORS.accent}
        />
        <StatCard
          title="Reports This Week"
          value={stats.reportsThisWeek}
          change="+5%" // You can calculate this from your API data
          color={CHART_COLORS.high}
        />
        <StatCard
          title="High Urgency"
          value={stats.highUrgencyReports}
          change="+8%" // You can calculate this from your API data
          color={CHART_COLORS.high}
        />
        <StatCard
          title="Response Rate"
          value={stats.responseRate}
          change="+2%" // You can calculate this from your API data
          color={CHART_COLORS.low}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Trend Chart */}
        <div className="bg-safecity-surface p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-safecity-text mb-4">
            Activity Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.surface}
              />
              <XAxis dataKey="day" stroke={CHART_COLORS.muted} />
              <YAxis stroke={CHART_COLORS.muted} />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_COLORS.surface,
                  border: "none",
                  borderRadius: "8px",
                  color: CHART_COLORS.text,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="reports"
                stroke={CHART_COLORS.accent}
                strokeWidth={2}
                name="Reports"
              />
              <Line
                type="monotone"
                dataKey="messages"
                stroke={CHART_COLORS.low}
                strokeWidth={2}
                name="Messages"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Urgency Distribution */}
        <div className="bg-safecity-surface p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-safecity-text mb-4">
            Urgency Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={urgencyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {urgencyDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === "High"
                        ? CHART_COLORS.high
                        : entry.name === "Medium"
                        ? CHART_COLORS.medium
                        : CHART_COLORS.low
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_COLORS.surface,
                  border: "none",
                  borderRadius: "8px",
                  color: CHART_COLORS.text,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-safecity-surface p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-safecity-text mb-4">
            Report Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categories}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.surface}
              />
              <XAxis dataKey="name" stroke={CHART_COLORS.muted} />
              <YAxis stroke={CHART_COLORS.muted} />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_COLORS.surface,
                  border: "none",
                  borderRadius: "8px",
                  color: CHART_COLORS.text,
                }}
              />
              <Bar
                dataKey="value"
                fill={CHART_COLORS.accent}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-safecity-surface p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-safecity-text mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {dashboardData.reports.slice(0, 5).map((report, index) => (
              <div
                key={report._id || index}
                className="flex items-center justify-between p-3 bg-safecity-dark rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-safecity-text font-medium">
                    {report.title}
                  </p>
                  <p className="text-safecity-muted text-sm">
                    {report.category} •{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-white text-xs rounded-full ${
                    report.urgency === "High"
                      ? "bg-red-500"
                      : report.urgency === "Medium"
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                >
                  {report.urgency}
                </span>
              </div>
            ))}
            {dashboardData.reports.length === 0 && (
              <p className="text-safecity-muted text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, color }) => (
  <div className="bg-safecity-surface p-6 rounded-xl">
    <h3 className="text-safecity-muted text-sm font-medium mb-2">{title}</h3>
    <div className="flex items-baseline justify-between">
      <p className="text-2xl font-bold text-safecity-text">{value}</p>
      <span
        className="text-sm font-medium"
        style={{
          color: change.startsWith("+") ? "#2a9d8f" : CHART_COLORS.accent,
        }}
      >
        {change}
      </span>
    </div>
  </div>
);

export default Dashboard;
