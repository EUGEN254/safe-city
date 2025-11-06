import React, { useState } from 'react';
import { 
  FiHelpCircle, 
  FiSearch, 
  FiBook, 
  FiMessageCircle, 
  FiPhone, 
  FiMail,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiStar,
  FiThumbsUp,
  FiThumbsDown,
  FiArrowLeft
} from 'react-icons/fi';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});

  const categories = [
    { id: 'all', name: 'All Topics', icon: <FiBook />, color: 'text-blue-400' },
    { id: 'getting-started', name: 'Getting Started', icon: <FiHelpCircle />, color: 'text-green-400' },
    { id: 'safety', name: 'Safety Features', icon: <FiMessageCircle />, color: 'text-red-400' },
    { id: 'emergency', name: 'Emergency', icon: <FiPhone />, color: 'text-orange-400' },
    { id: 'account', name: 'Account & Settings', icon: <FiMail />, color: 'text-purple-400' }
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I report an emergency?",
      answer: "To report an emergency, tap the red 'Report Emergency' button on the main screen. You'll be prompted to select the type of emergency, add details, and share your location. The app will immediately notify emergency services and your trusted contacts.",
      category: 'emergency',
      tags: ['emergency', 'reporting', 'safety']
    },
    {
      id: 2,
      question: "How can I add emergency contacts?",
      answer: "Go to the 'Emergency Contacts' section in the app, tap the '+' button, and select contacts from your phone or manually enter their information. You can assign relationships and set priority levels for each contact.",
      category: 'safety',
      tags: ['contacts', 'safety', 'setup']
    },
    {
      id: 3,
      question: "Is my location data private?",
      answer: "Yes, SafeCity takes your privacy seriously. Your location data is only shared with emergency services and trusted contacts when you explicitly report an incident. We use end-to-end encryption and never sell your data to third parties.",
      category: 'account',
      tags: ['privacy', 'location', 'data']
    },
    {
      id: 4,
      question: "How do I enable location sharing?",
      answer: "Navigate to Settings > Location Services and enable 'Share My Location'. You can choose to share continuously, only during emergencies, or with specific contacts. The app will request necessary permissions from your device.",
      category: 'account',
      tags: ['location', 'settings', 'sharing']
    },
    {
      id: 5,
      question: "What should I do if I accidentally trigger an emergency?",
      answer: "If you accidentally trigger an emergency, immediately tap the 'Cancel' button that appears during the countdown. If the alert was already sent, use the 'False Alarm' feature to notify contacts and emergency services that it was accidental.",
      category: 'emergency',
      tags: ['emergency', 'false-alarm', 'cancel']
    },
    {
      id: 6,
      question: "How do I update my personal information?",
      answer: "Go to Settings > Account to update your personal information, including your name, phone number, and emergency medical information. Keeping this information current ensures better assistance during emergencies.",
      category: 'account',
      tags: ['account', 'profile', 'update']
    }
  ];

  const popularArticles = [
    {
      id: 101,
      title: "Setting Up Your Safety Profile",
      description: "Complete guide to setting up your safety information and preferences",
      category: 'getting-started',
      reads: '2.4k'
    },
    {
      id: 102,
      title: "Understanding Emergency Alerts",
      description: "Learn about different types of alerts and when they're triggered",
      category: 'safety',
      reads: '1.8k'
    },
    {
      id: 103,
      title: "Privacy and Data Security",
      description: "How SafeCity protects your personal information and location data",
      category: 'account',
      reads: '1.2k'
    }
  ];

  const contactMethods = [
    {
      method: "Emergency Support",
      description: "Immediate assistance for urgent safety concerns",
      icon: <FiPhone className="text-xl" />,
      details: "Available 24/7",
      action: "Call Now",
      color: "text-red-400"
    },
    {
      method: "Email Support",
      description: "General questions and non-urgent support",
      icon: <FiMail className="text-xl" />,
      details: "support@safecity.com",
      action: "Send Email",
      color: "text-blue-400"
    },
    {
      method: "Live Chat",
      description: "Real-time help from our support team",
      icon: <FiMessageCircle className="text-xl" />,
      details: "Available 9AM-9PM EST",
      action: "Start Chat",
      color: "text-green-400"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFaqToggle = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleFeedback = (faqId, helpful) => {
    setFeedbackGiven(prev => ({
      ...prev,
      [faqId]: helpful
    }));
  };

  const renderArticleView = () => (
    <div className="min-h-screen bg-safecity-dark p-4 md:p-6">
      <button 
        onClick={() => setSelectedArticle(null)}
        className="flex items-center space-x-2 text-safecity-accent hover:text-safecity-accent-hover mb-6 transition-colors"
      >
        <FiArrowLeft />
        <span>Back to Help Center</span>
      </button>

      <div className="bg-safecity-surface rounded-xl p-6">
        <div className="flex items-center space-x-2 text-safecity-muted text-sm mb-4">
          <span>{selectedArticle.category}</span>
          <span>•</span>
          <span>{selectedArticle.reads} reads</span>
        </div>
        
        <h1 className="text-3xl font-bold text-safecity-text mb-4">
          {selectedArticle.title}
        </h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-safecity-muted text-lg mb-6">
            {selectedArticle.description}
          </p>
          
          <div className="bg-safecity-dark rounded-lg p-6 my-6">
            <h3 className="text-xl font-semibold text-safecity-text mb-3">In this article</h3>
            <ul className="text-safecity-muted space-y-2">
              <li>• Setting up your basic information</li>
              <li>• Configuring emergency contacts</li>
              <li>• Setting location preferences</li>
              <li>• Customizing notification settings</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-safecity-text my-6">Getting Started</h2>
          <p className="text-safecity-muted mb-4">
            Welcome to SafeCity! This comprehensive guide will help you set up your safety profile to ensure you get the most out of our safety features.
          </p>

          <h3 className="text-xl font-semibold text-safecity-text my-4">Basic Information</h3>
          <p className="text-safecity-muted mb-4">
            Start by filling out your basic information in the Profile section. This includes your name, age, and any medical conditions that emergency responders should know about.
          </p>

          <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg p-4 my-6">
            <p className="text-yellow-400 text-sm">
              <strong>Tip:</strong> Keep your medical information updated regularly to ensure emergency services have the most current information.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-6 mt-8">
          <p className="text-safecity-muted mb-4">Was this article helpful?</p>
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors">
              <FiThumbsUp />
              <span>Yes</span>
            </button>
            <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
              <FiThumbsDown />
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (selectedArticle) {
    return renderArticleView();
  }

  return (
    <div className="min-h-screen bg-safecity-dark p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <FiHelpCircle className="text-2xl text-safecity-accent" />
          <h1 className="text-3xl font-bold text-safecity-text">Help Center</h1>
        </div>
        <p className="text-safecity-muted">Find answers and get support for SafeCity</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-safecity-surface text-safecity-text rounded-xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-safecity-accent"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-safecity-muted text-xl" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-3 pb-4 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                activeCategory === category.id
                  ? 'bg-safecity-accent text-white'
                  : 'bg-safecity-surface text-safecity-text hover:bg-gray-700'
              }`}
            >
              <span className={category.color}>{category.icon}</span>
              <span className="whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-safecity-text mb-4">Popular Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-safecity-surface rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-safecity-accent bg-opacity-20 flex items-center justify-center ${
                  categories.find(c => c.id === article.category)?.color
                }`}>
                  {categories.find(c => c.id === article.category)?.icon}
                </div>
                <FiExternalLink className="text-safecity-muted group-hover:text-safecity-accent transition-colors" />
              </div>
              <h3 className="text-safecity-text font-semibold mb-2 group-hover:text-safecity-accent transition-colors">
                {article.title}
              </h3>
              <p className="text-safecity-muted text-sm mb-3">{article.description}</p>
              <div className="flex items-center justify-between text-xs text-safecity-muted">
                <span>{article.reads} reads</span>
                <span className="capitalize">{article.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-safecity-text mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-safecity-surface rounded-xl overflow-hidden">
              <button
                onClick={() => handleFaqToggle(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700 transition-colors"
              >
                <span className="text-safecity-text font-medium pr-4">{faq.question}</span>
                {expandedFaq === faq.id ? <FiChevronUp className="text-safecity-accent flex-shrink-0" /> : <FiChevronDown className="text-safecity-muted flex-shrink-0" />}
              </button>
              
              {expandedFaq === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-safecity-muted mb-4">{faq.answer}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {faq.tags.map((tag, index) => (
                      <span key={index} className="bg-safecity-dark text-safecity-muted px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {!feedbackGiven[faq.id] && (
                    <div className="border-t border-gray-600 pt-4">
                      <p className="text-safecity-muted text-sm mb-2">Was this helpful?</p>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleFeedback(faq.id, true)}
                          className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <FiThumbsUp />
                          <span>Yes</span>
                        </button>
                        <button
                          onClick={() => handleFeedback(faq.id, false)}
                          className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FiThumbsDown />
                          <span>No</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {feedbackGiven[faq.id] !== undefined && (
                    <div className="border-t border-gray-600 pt-4">
                      <p className="text-green-400 text-sm">
                        {feedbackGiven[faq.id] 
                          ? "Thank you for your feedback! 😊" 
                          : "Sorry this wasn't helpful. Contact support for more help."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-safecity-surface rounded-xl">
            <FiHelpCircle className="text-6xl text-safecity-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl text-safecity-text mb-2">No results found</h3>
            <p className="text-safecity-muted">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-safecity-text mb-4">Still Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactMethods.map((contact, index) => (
            <div key={index} className="bg-safecity-surface rounded-xl p-6 text-center">
              <div className={`w-12 h-12 rounded-full bg-safecity-accent bg-opacity-20 flex items-center justify-center mx-auto mb-4 ${contact.color}`}>
                {contact.icon}
              </div>
              <h3 className="text-safecity-text font-semibold mb-2">{contact.method}</h3>
              <p className="text-safecity-muted text-sm mb-3">{contact.description}</p>
              <p className="text-safecity-text text-sm mb-4">{contact.details}</p>
              <button className="bg-safecity-accent hover:bg-safecity-accent-hover text-white px-6 py-2 rounded-lg transition-colors w-full">
                {contact.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <FiPhone className="text-red-400" />
          <h3 className="text-white font-semibold">Emergency Support</h3>
        </div>
        <p className="text-white mb-3">
          For immediate danger or emergency situations, please call local emergency services first.
        </p>
        <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          Call Emergency Services
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;