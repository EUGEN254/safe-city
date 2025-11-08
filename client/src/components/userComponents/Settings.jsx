import React, { useState, useEffect } from "react";
import {
  FiSettings,
  FiBell,
  FiShield,
  FiMap,
  FiUser,
  FiMoon,
  FiSun,
  FiChevronRight,
  FiGlobe,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useSafeCity } from "../../context/SafeCity";
import { languages } from "../../assets/assets";

const Settings = ({ darkMode, setDarkMode, lang, setLang }) => {
  const [activeSection, setActiveSection] = useState("general");
  const { backendUrl } = useSafeCity();
  const [region, setRegion] = useState("Unknown");

  // Notification states
  const [notifications, setNotifications] = useState({
    emergencyAlerts: false,
    safetyUpdates: false,
    communityReports: false,
    locationBased: false,
  });
  const [loadingNotifications, setLoadingNotifications] = useState({});

  // Privacy states
  const [privacySettings, setPrivacySettings] = useState({
    shareLocation: true,
    showOnMap: false,
    anonymousReporting: true,
    dataCollection: true,
  });

  // Account password states
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loadingPassword, setLoadingPassword] = useState(false);

  // ---------------- Notifications ----------------
  const enableNotification = async (notificationType, enabled) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/settings/notification`,
        { notificationType, enabled },
        { withCredentials: true }
      );
      if (!response.data.success) throw new Error(response.data.message);
      toast.success("Notification preference updated!");
    } catch (error) {
      toast.error(error.message || "Failed to update notification.");
    }
  };

  const handleNotificationToggle = async (key) => {
    if (loadingNotifications[key]) return;
    const newValue = !notifications[key];
    setLoadingNotifications((prev) => ({ ...prev, [key]: true }));
    setNotifications((prev) => ({ ...prev, [key]: newValue }));
    try {
      await enableNotification(key, newValue);
    } finally {
      setLoadingNotifications((prev) => ({ ...prev, [key]: false }));
    }
  };

  // ---------------- Privacy ----------------
  const handlePrivacyToggle = async (key) => {
    const newValue = !privacySettings[key];
    setPrivacySettings((prev) => ({ ...prev, [key]: newValue }));

    try {
      await axios.post(
        `${backendUrl}/api/settings/privacy`,
        { key, value: newValue },
        { withCredentials: true }
      );
      toast.success("Privacy setting updated!");
    } catch (err) {
      toast.error("Failed to update privacy setting");
      setPrivacySettings((prev) => ({ ...prev, [key]: !newValue }));
    }
  };

  // ---------------- Account Password ----------------
  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New password and confirm password do not match!");
    }
    setLoadingPassword(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/settings/account/change-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoadingPassword(false);
    }
  };

  // ---------------- Fetch region ----------------
  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setRegion(`${data.country_name} / ${data.country_code}`);
      } catch (err) {
        setRegion("Unknown / ?");
      }
    };
    fetchRegion();
  }, []);

  // ---------------- Notification & Privacy Descriptions ----------------
  const getNotificationDescription = (key) => {
    const descriptions = {
      emergencyAlerts:
        lang === "en"
          ? "Immediate safety alerts in your area"
          : "Arifa za usalama mara moja katika eneo lako",
      safetyUpdates:
        lang === "en"
          ? "General safety news and updates"
          : "Habari na masasisho ya usalama",
      communityReports:
        lang === "en"
          ? "Reports from other SafeCity users"
          : "Ripoti kutoka kwa watumiaji wengine wa SafeCity",
      locationBased:
        lang === "en"
          ? "Alerts based on your current location"
          : "Arifa kulingana na eneo ulipo sasa",
    };
    return descriptions[key] || "";
  };

  const getPrivacyDescription = (key) => {
    const descriptions = {
      shareLocation:
        lang === "en"
          ? "Share your location for better safety services"
          : "Shiriki eneo lako kwa huduma bora za usalama",
      showOnMap:
        lang === "en"
          ? "Make your location visible to trusted contacts"
          : "Fanya eneo lako liwe dhahiri kwa waliokubaliwa",
      anonymousReporting:
        lang === "en"
          ? "Submit reports without revealing identity"
          : "Tuma ripoti bila kufichua utambulisho",
      dataCollection:
        lang === "en"
          ? "Help improve SafeCity with anonymous data"
          : "Saidia kuboresha SafeCity kwa data isiyo ya kibinafsi",
    };
    return descriptions[key] || "";
  };

  // ---------------- Sidebar Sections ----------------
  const sections = [
    { id: "general", title: languages[lang].general, icon: <FiSettings className="text-xl" />, description: "App preferences and basic settings" },
    { id: "notifications", title: languages[lang].notifications, icon: <FiBell className="text-xl" />, description: "Manage your alert preferences" },
    { id: "privacy", title: languages[lang].privacy, icon: <FiShield className="text-xl" />, description: "Control your data and privacy" },
    { id: "location", title: languages[lang].location, icon: <FiMap className="text-xl" />, description: "Location sharing preferences" },
    { id: "account", title: languages[lang].account, icon: <FiUser className="text-xl" />, description: "Manage your account settings" },
  ];

  // ---------------- Render Sections ----------------
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Dark Mode */}
      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">
          {languages[lang].appearance}
        </h3>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            {darkMode ? <FiMoon className="text-safecity-accent" /> : <FiSun className="text-yellow-500" />}
            <div>
              <p className="text-safecity-text font-medium">{languages[lang].darkMode}</p>
              <p className="text-safecity-muted text-sm">{languages[lang].darkModeDesc}</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? "bg-safecity-accent" : "bg-gray-600"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">
          {languages[lang].language} & {languages[lang].region}
        </h3>

        <div className="flex items-center justify-between py-3 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <FiGlobe className="text-safecity-muted" />
            <div>
              <p className="text-safecity-text font-medium">{languages[lang].language}</p>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-safecity-surface text-safecity-text px-3 py-1 rounded-md mt-1"
              >
                <option value="en">{languages.en.english}</option>
                <option value="sw">{languages.sw.kiswahili}</option>
              </select>
            </div>
          </div>
          <FiChevronRight className="text-safecity-muted" />
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <FiMap className="text-safecity-muted" />
            <div>
              <p className="text-safecity-text font-medium">{languages[lang].region}</p>
              <p className="text-safecity-muted text-sm">{region}</p>
            </div>
          </div>
          <FiChevronRight className="text-safecity-muted" />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">{languages[lang].notifications}</h3>
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-600 last:border-b-0">
            <div>
              <p className="text-safecity-text font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
              <p className="text-safecity-muted text-sm">{getNotificationDescription(key)}</p>
            </div>
            <button
              onClick={() => handleNotificationToggle(key)}
              disabled={loadingNotifications[key]}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-safecity-accent" : "bg-gray-600"} ${loadingNotifications[key] ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">{languages[lang].privacy}</h3>
        {Object.entries(privacySettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-600 last:border-b-0">
            <div>
              <p className="text-safecity-text font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
              <p className="text-safecity-muted text-sm">{getPrivacyDescription(key)}</p>
            </div>
            <button
              onClick={() => handlePrivacyToggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-safecity-accent" : "bg-gray-600"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6 bg-safecity-surface rounded-xl p-6">
      <h3 className="text-lg font-semibold text-safecity-text mb-4">{languages[lang].account}</h3>
      {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
        <div key={field} className="relative mb-4">
          <input
            type={showPassword[field.split("Password")[0]] ? "text" : "password"}
            placeholder={
              field === "currentPassword"
                ? "Current Password"
                : field === "newPassword"
                ? "New Password"
                : "Confirm Password"
            }
            value={passwords[field]}
            onChange={(e) => setPasswords((prev) => ({ ...prev, [field]: e.target.value }))}
            className="w-full px-4 py-2 rounded-md bg-safecity-dark text-safecity-text"
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-safecity-muted"
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                [field.split("Password")[0]]: !prev[field.split("Password")[0]],
              }))
            }
          >
            {showPassword[field.split("Password")[0]] ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
      ))}
      <button
        onClick={handlePasswordChange}
        disabled={loadingPassword}
        className="bg-safecity-accent text-white px-6 py-2 rounded-md hover:opacity-90 transition"
      >
        {loadingPassword ? "Updating..." : "Change Password"}
      </button>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings();
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      case "account":
        return renderAccountSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-safecity-dark p-4 md:p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <FiSettings className="text-2xl text-safecity-accent" />
          <h1 className="text-3xl font-bold text-safecity-text">{languages[lang].settings}</h1>
        </div>
        <p className="text-safecity-muted">Manage your SafeCity preferences and privacy</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-safecity-surface rounded-xl p-4 sticky top-6">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-safecity-accent text-white"
                      : "text-safecity-text hover:bg-gray-700"
                  }`}
                >
                  {section.icon}
                  <div className="flex-1 text-left">
                    <p className="font-medium">{section.title}</p>
                    <p className="text-sm opacity-80">{section.description}</p>
                  </div>
                  <FiChevronRight className={`transition-transform ${activeSection === section.id ? "rotate-90" : ""}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-2/3">{renderActiveSection()}</div>
      </div>
    </div>
  );
};

export default Settings;
