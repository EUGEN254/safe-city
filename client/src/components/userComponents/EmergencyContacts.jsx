import React, { useState } from 'react';
import {
  FaSearch,
  FaCarCrash,
  FaFireExtinguisher,
  FaAmbulance,
  FaFlask,
  FaCommentMedical,
  FaShieldAlt,
  FaCar,
  FaPhoneAlt,
  FaSms,
  FaExclamationTriangle,
  FaHeart
} from "react-icons/fa";

const EmergencyContacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const emergencyContacts = [
    {
      id: 1,
      name: "Police Emergency",
      number: "911",
      category: "emergency",
      icon: <FaCarCrash />,
      description: "Immediate police assistance"
    },
    {
      id: 2,
      name: "Fire Department",
      number: "911",
      category: "emergency",
      icon: <FaFireExtinguisher />,
      description: "Fire and rescue services"
    },
    {
      id: 3,
      name: "Ambulance",
      number: "911",
      category: "emergency",
      icon: <FaAmbulance />,
      description: "Medical emergencies"
    },
    {
      id: 4,
      name: "Poison Control",
      number: "1-800-222-1222",
      category: "medical",
      icon: <FaFlask />,
      description: "24/7 poison assistance"
    },
    {
      id: 5,
      name: "Suicide Prevention",
      number: "988",
      category: "crisis",
      icon: <FaCommentMedical />,
      description: "Mental health crisis support"
    },
    {
      id: 6,
      name: "Domestic Violence",
      number: "1-800-799-7233",
      category: "crisis",
      icon: <FaShieldAlt />,
      description: "Domestic abuse support"
    },
    {
      id: 7,
      name: "Roadside Assistance",
      number: "1-800-AAA-HELP",
      category: "transport",
      icon: <FaCar />,
      description: "Vehicle breakdown help"
    },
    {
      id: 8,
      name: "Women's Helpline",
      number: "1091",
      category: "safety",
      icon: <FaShieldAlt />,
      description: "Women safety and support"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Contacts', icon: <FaPhoneAlt /> },
    { id: 'emergency', name: 'Emergency', icon: <FaExclamationTriangle /> },
    { id: 'medical', name: 'Medical', icon: <FaAmbulance /> },
    { id: 'crisis', name: 'Crisis', icon: <FaCommentMedical /> },
    { id: 'safety', name: 'Safety', icon: <FaShieldAlt /> },
    { id: 'transport', name: 'Transport', icon: <FaCar /> }
  ];

  const filteredContacts = emergencyContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCall = (number) => {
    if (window.confirm(`Call ${number}?`)) {
      window.open(`tel:${number}`);
    }
  };

  const handleSMS = (number) => {
    window.open(`sms:${number}`);
  };

  return (
    <div className="min-h-screen bg-safecity-dark p-4 md:p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-safecity-text mb-2">Emergency Contacts</h1>
        <p className="text-safecity-muted">Quick access to emergency services and support</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search emergency contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-safecity-surface text-safecity-text rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-safecity-accent"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-safecity-muted" />
        </div>
      </div>

      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-safecity-accent text-white'
                  : 'bg-safecity-surface text-safecity-text hover:bg-safecity-accent-hover'
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-safecity-surface rounded-xl p-4 hover:transform hover:scale-105 transition-all duration-200 border border-safecity-surface hover:border-safecity-accent"
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl text-safecity-accent">{contact.icon}</div>
              <div>
                <h3 className="text-safecity-text font-semibold">{contact.name}</h3>
                <p className="text-safecity-muted text-sm">{contact.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-safecity-accent font-mono text-lg font-bold">
                {contact.number}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCall(contact.number)}
                  className="bg-safecity-accent hover:bg-safecity-accent-hover text-white p-2 rounded-full transition-colors"
                >
                  <FaPhoneAlt />
                </button>
                <button
                  onClick={() => handleSMS(contact.number)}
                  className="bg-safecity-surface hover:bg-safecity-accent text-safecity-text hover:text-white p-2 rounded-full transition-colors border border-safecity-muted"
                >
                  <FaSms />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <button
          onClick={() => handleCall('911')}
          className="bg-safecity-accent hover:bg-safecity-accent-hover text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
        >
          <FaExclamationTriangle className="text-xl" />
        </button>
        <button
          onClick={() => handleCall('988')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
        >
          <FaHeart className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default EmergencyContacts;
