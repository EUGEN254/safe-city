import Message from "../models/messages.js";
import Notification from "../models/notification.js";
import Report from "../models/report.js";
import {  getDateRange,
  calculateResponseRate,
  getCategoryDistribution,
  getWeeklyTrend,
  getUrgencyDistribution} from "../utils/dashboardUtils.js";

const getDashBoardData = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    const userId = req.user._id;

    const startDate = getDateRange(timeRange);

    // Get reports data
    const reports = await Report.find({
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    // Get messages data
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      createdAt: { $gte: startDate }
    });

    // Get notifications
    const notifications = await Notification.find({ 
      user: userId,
      createdAt: { $gte: startDate }
    });

    // Calculate stats
    const totalReports = await Report.countDocuments();
    const reportsThisWeek = reports.length;
    const highUrgencyReports = reports.filter(r => r.urgency === 'High').length;
    const messagesCount = messages.length;

    const stats = {
      totalReports,
      reportsThisWeek,
      highUrgencyReports,
      messagesCount,
      responseRate: calculateResponseRate(messages),
      categories: getCategoryDistribution(reports),
      weeklyTrend: getWeeklyTrend(reports, messages),
      urgencyDistribution: getUrgencyDistribution(reports)
    };

    res.json({
      success: true,
      data: { 
        reports: reports.slice(0, 10), // Last 10 reports for recent activity
        messages: messages.slice(0, 10),
        notifications,
        stats 
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

export {getDashBoardData}