import React, { useState } from 'react';
import { 
  FiSettings, 
  FiBell, 
  FiShield, 
  FiMap, 
  FiUser, 
  FiMoon, 
  FiSun,
  FiHelpCircle,
  FiLogOut,
  FiTrash2,
  FiChevronRight,
  FiDownload,
  FiGlobe,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    safetyUpdates: true,
    communityReports: false,
    locationBased: true
  });
  const [privacySettings, setPrivacySettings] = useState({
    shareLocation: true,
    showOnMap: false,
    anonymousReporting: true,
    dataCollection: true
  });

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const sections = [
    {
      id: 'general',
      title: 'General Settings',
      icon: <FiSettings className="text-xl" />,
      description: 'App preferences and basic settings'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <FiBell className="text-xl" />,
      description: 'Manage your alert preferences'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <FiShield className="text-xl" />,
      description: 'Control your data and privacy'
    },
    {
      id: 'location',
      title: 'Location Services',
      icon: <FiMap className="text-xl" />,
      description: 'Location sharing preferences'
    },
    {
      id: 'account',
      title: 'Account',
      icon: <FiUser className="text-xl" />,
      description: 'Manage your account settings'
    }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">Appearance</h3>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            {darkMode ? <FiMoon className="text-safecity-accent" /> : <FiSun className="text-yellow-500" />}
            <div>
              <p className="text-safecity-text font-medium">Dark Mode</p>
              <p className="text-safecity-muted text-sm">Switch between light and dark themes</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? 'bg-safecity-accent' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">Language & Region</h3>
        <div className="flex items-center justify-between py-3 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <FiGlobe className="text-safecity-muted" />
            <div>
              <p className="text-safecity-text font-medium">Language</p>
              <p className="text-safecity-muted text-sm">English (US)</p>
            </div>
          </div>
          <FiChevronRight className="text-safecity-muted" />
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <FiMap className="text-safecity-muted" />
            <div>
              <p className="text-safecity-text font-medium">Region</p>
              <p className="text-safecity-muted text-sm">United States</p>
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
        <h3 className="text-lg font-semibold text-safecity-text mb-4">Alert Preferences</h3>
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-600 last:border-b-0">
            <div>
              <p className="text-safecity-text font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-safecity-muted text-sm">
                {getNotificationDescription(key)}
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-safecity-accent' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">Privacy Controls</h3>
        {Object.entries(privacySettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-600 last:border-b-0">
            <div>
              <p className="text-safecity-text font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-safecity-muted text-sm">
                {getPrivacyDescription(key)}
              </p>
            </div>
            <button
              onClick={() => handlePrivacyToggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-safecity-accent' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">Data Management</h3>
        <button className="flex items-center justify-between w-full py-3 border-b border-gray-600 text-safecity-text hover:text-safecity-accent transition-colors">
          <div className="flex items-center space-x-3">
            <FiDownload className="text-safecity-muted" />
            <span>Export My Data</span>
          </div>
          <FiChevronRight className="text-safecity-muted" />
        </button>
        <button className="flex items-center justify-between w-full py-3 text-red-400 hover:text-red-300 transition-colors">
          <div className="flex items-center space-x-3">
            <FiTrash2 className="text-red-400" />
            <span>Delete Account</span>
          </div>
          <FiChevronRight className="text-red-400" />
        </button>
      </div>
    </div>
  );

  const renderLocationSettings = () => (
    <div className="space-y-6">
      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">Location Services</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-safecity-text font-medium">Precise Location</p>
              <p className="text-safecity-muted text-sm">Use your precise location for better safety alerts</p>
            </div>
            <button className="bg-safecity-accent hover:bg-safecity-accent-hover text-white px-4 py-2 rounded-lg transition-colors">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-safecity-text font-medium">Background Location</p>
              <p className="text-safecity-muted text-sm">Receive alerts even when app is not in use</p>
            </div>
            <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-safecity-muted">Email</span>
            <span className="text-safecity-text">user@example.com</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-safecity-muted">Phone</span>
            <span className="text-safecity-text">+1 (555) 123-4567</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-safecity-muted">Member since</span>
            <span className="text-safecity-text">January 2024</span>
          </div>
        </div>
      </div>

      <div className="bg-safecity-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold text-safecity-text mb-4">Support</h3>
        <button className="flex items-center justify-between w-full py-3 border-b border-gray-600 text-safecity-text hover:text-safecity-accent transition-colors">
          <div className="flex items-center space-x-3">
            <FiHelpCircle className="text-safecity-muted" />
            <span>Help & Support</span>
          </div>
          <FiChevronRight className="text-safecity-muted" />
        </button>
        <button className="flex items-center justify-between w-full py-3 border-b border-gray-600 text-safecity-text hover:text-safecity-accent transition-colors">
          <div className="flex items-center space-x-3">
            <FiShield className="text-safecity-muted" />
            <span>Privacy Policy</span>
          </div>
          <FiChevronRight className="text-safecity-muted" />
        </button>
        <button className="flex items-center justify-between w-full py-3 text-red-400 hover:text-red-300 transition-colors">
          <div className="flex items-center space-x-3">
            <FiLogOut className="text-red-400" />
            <span>Sign Out</span>
          </div>
          <FiChevronRight className="text-red-400" />
        </button>
      </div>
    </div>
  );

  const getNotificationDescription = (key) => {
    const descriptions = {
      emergencyAlerts: 'Immediate safety alerts in your area',
      safetyUpdates: 'General safety news and updates',
      communityReports: 'Reports from other SafeCity users',
      locationBased: 'Alerts based on your current location'
    };
    return descriptions[key] || 'Notification setting';
  };

  const getPrivacyDescription = (key) => {
    const descriptions = {
      shareLocation: 'Share your location for better safety services',
      showOnMap: 'Make your location visible to trusted contacts',
      anonymousReporting: 'Submit reports without revealing identity',
      dataCollection: 'Help improve SafeCity with anonymous data'
    };
    return descriptions[key] || 'Privacy setting';
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'location':
        return renderLocationSettings();
      case 'account':
        return renderAccountSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-safecity-dark p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <FiSettings className="text-2xl text-safecity-accent" />
          <h1 className="text-3xl font-bold text-safecity-text">Settings</h1>
        </div>
        <p className="text-safecity-muted">Manage your SafeCity preferences and privacy</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/3">
          <div className="bg-safecity-surface rounded-xl p-4 sticky top-6">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-safecity-accent text-white'
                      : 'text-safecity-text hover:bg-gray-700'
                  }`}
                >
                  {section.icon}
                  <div className="flex-1 text-left">
                    <p className="font-medium">{section.title}</p>
                    <p className="text-sm opacity-80">{section.description}</p>
                  </div>
                  <FiChevronRight className={`transition-transform ${
                    activeSection === section.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="bg-safecity-surface rounded-xl p-6">
            <h2 className="text-2xl font-bold text-safecity-text mb-2">
              {sections.find(s => s.id === activeSection)?.title}
            </h2>
            <p className="text-safecity-muted mb-6">
              {sections.find(s => s.id === activeSection)?.description}
            </p>
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;