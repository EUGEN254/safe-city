// utils/dashboardUtils.js
const getDateRange = (timeRange) => {
  const now = new Date();
  const range = new Date();

  switch (timeRange) {
    case 'week':
      range.setDate(now.getDate() - 7);
      break;
    case 'month':
      range.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      range.setFullYear(now.getFullYear() - 1);
      break;
    default:
      range.setDate(now.getDate() - 7); // Default to week
  }

  return range;
};

// Calculate response rate based on messages
const calculateResponseRate = (messages) => {
  if (!messages || messages.length === 0) return '0%';
  
  const userMessages = messages.filter(msg => 
    msg.senderId.toString() !== 'support-team-id' // Adjust based on your support ID
  );
  const supportResponses = messages.filter(msg => 
    msg.senderId.toString() === 'support-team-id'
  );
  
  const rate = (supportResponses.length / userMessages.length) * 100;
  return isNaN(rate) ? '0%' : `${Math.round(rate)}%`;
};

// Get category distribution from reports
const getCategoryDistribution = (reports) => {
  const categoryCount = {};
  
  reports.forEach(report => {
    const category = report.category || 'Other';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  return Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value
  }));
};

// Get weekly trend data
const getWeeklyTrend = (reports, messages) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trend = days.map(day => ({ day, reports: 0, messages: 0 }));

  // Count reports by day of week
  reports.forEach(report => {
    const dayIndex = new Date(report.createdAt).getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Adjust for Monday start
    if (trend[adjustedIndex]) {
      trend[adjustedIndex].reports++;
    }
  });

  // Count messages by day of week
  messages.forEach(message => {
    const dayIndex = new Date(message.createdAt).getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    if (trend[adjustedIndex]) {
      trend[adjustedIndex].messages++;
    }
  });

  return trend;
};

// Get urgency distribution
const getUrgencyDistribution = (reports) => {
  const urgencyCount = {
    High: 0,
    Medium: 0,
    Low: 0
  };

  reports.forEach(report => {
    const urgency = report.urgency || 'Low';
    urgencyCount[urgency] = (urgencyCount[urgency] || 0) + 1;
  });

  return Object.entries(urgencyCount).map(([name, value]) => ({
    name,
    value
  }));
};

export{
  getDateRange,
  calculateResponseRate,
  getCategoryDistribution,
  getWeeklyTrend,
  getUrgencyDistribution
};