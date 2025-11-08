// SafetyTips.jsx
import React, { useState } from "react";
import {
  FaUserShield,
  FaLock,
  FaPhoneAlt,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const SafetyTips = () => {
  const [activeTab, setActiveTab] = useState("Personal");

  const categories = [
    { id: 1, name: "Personal", icon: <FaUserShield /> },
    { id: 2, name: "Online", icon: <FaLock /> },
    { id: 3, name: "Emergency", icon: <FaPhoneAlt /> },
    { id: 4, name: "Community", icon: <FaUsers /> },
  ];

  const personal = [
    { id: 1, name: "Stay alert and aware of your surroundings." },
    { id: 2, name: "Avoid walking alone late at night in isolated areas." },
    { id: 3, name: "Keep your personal items (phone, wallet, ID) secure." },
    { id: 4, name: "Share your location with trusted contacts when going out." },
    { id: 5, name: "Learn basic self-defense or emergency responses." },
  ];

  const online = [
    { id: 1, name: "Use strong and unique passwords for every account." },
    { id: 2, name: "Don’t share personal info (address, phone) publicly online." },
    { id: 3, name: "Beware of phishing emails and fake links." },
    { id: 4, name: "Enable 2FA (Two-Factor Authentication) on accounts." },
    { id: 5, name: "Keep your software and antivirus updated." },
  ];

  const emergency = [
    {
      id: 1,
      name: "Display emergency numbers: Police, Ambulance, Fire Department.",
    },
    { id: 2, name: "Add 'Save to contacts' or 'Call now' buttons." },
    {
      id: 3,
      name: "Stay calm, provide your location, and describe the emergency.",
    },
    { id: 4, name: "Keep key contacts visible or saved on your phone." },
    { id: 5, name: "Plan escape routes and safe meeting points." },
  ];

  const community = [
    { id: 1, name: "Report suspicious activity via SafeCity." },
    { id: 2, name: "Join or create neighborhood watch groups." },
    { id: 3, name: "Help vulnerable individuals (children, elderly)." },
    { id: 4, name: "Volunteer in community safety initiatives." },
    { id: 5, name: "Share verified safety tips with others." },
  ];

  const getActiveTips = () => {
    switch (activeTab) {
      case "Personal":
        return personal;
      case "Online":
        return online;
      case "Emergency":
        return emergency;
      case "Community":
        return community;
      default:
        return [];
    }
  };

  return (
    <section
      aria-label="SafeCity Safety Tips"
      className="p-6 rounded-2xl shadow-md bg-safecity-dark text-safecity-text"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">SafeTips</h2>
        <span className="text-safecity-muted text-sm">Learn & stay safe</span>
      </div>

      {/* Tabs */}
      <nav
        role="tablist"
        aria-label="SafeTip categories"
        className="flex gap-3 overflow-x-auto no-scrollbar pb-3"
      >
        {categories.map((cat) => {
          const active = activeTab === cat.name;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(cat.name)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg min-w-[110px] transition-all duration-150
                ${active ? "bg-safecity-accent shadow-md" : "bg-safecity-surface hover:brightness-110"}`}
              // active tab text should be readable on accent; use inline var for dark text
              style={active ? { color: "var(--color-dark)" } : { color: "var(--color-text)" }}
            >
              <span className="text-lg" aria-hidden>
                {cat.icon}
              </span>
              <span className="font-medium">{cat.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Tips List */}
      <div className="mt-4 grid gap-3">
        {getActiveTips().map((tip) => (
          <article
            key={tip.id}
            className="flex items-start gap-3 p-3 bg-safecity-surface rounded-lg"
            aria-label={`Tip ${tip.id}`}
          >
            <div className="mt-1">
              <FaCheckCircle className="text-safecity-accent text-lg" />
            </div>
            <p className="text-safecity-text leading-relaxed">{tip.name}</p>
          </article>
        ))}

        {/* If no tips (defensive) */}
        {getActiveTips().length === 0 && (
          <div className="p-4 bg-safecity-surface rounded-lg text-safecity-muted">
            No tips available for this category.
          </div>
        )}
      </div>
    </section>
  );
};

export default SafetyTips;
