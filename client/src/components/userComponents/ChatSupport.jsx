import React, { useState, useEffect } from "react";
import {
  FiShield,
  FiHeart,
  FiAlertCircle,
  FiSearch,
  FiSend,
  FiHelpCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { assets, messagesDummyData } from "../../assets/assets";
import { useSafeCity } from "../../context/SafeCity";

const ChatSupportSelector = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { supportTeam, roles, fetchSupportTeam, isUserOnline } = useSafeCity();

  // Fetch support team data when component mounts
  useEffect(() => {
    fetchSupportTeam();
  }, []);

  // Set first user as active when role is selected
  useEffect(() => {
    if (selectedRole && supportTeam[selectedRole] && supportTeam[selectedRole].length > 0) {
      setActiveUser(supportTeam[selectedRole][0]);
    }
  }, [selectedRole, supportTeam]);

  // Filter users based on search term
  const filteredUsers = selectedRole && supportTeam[selectedRole] 
    ? supportTeam[selectedRole].filter(user =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Get role display name and icon
  const getRoleInfo = (role) => {
    const roleConfig = {
      admin: {
        name: "Admin Support",
        description: "General inquiries and safety support.",
        icon: <FiShield size={22} />
      },
      doctor: {
        name: "Medical Doctor",
        description: "For medical help and health emergencies.",
        icon: <FiHeart size={22} />
      },
      police: {
        name: "Police Officer",
        description: "For reporting crime or immediate danger.",
        icon: <FiAlertCircle size={22} />
      }
    };
    
    return roleConfig[role] || {
      name: `${role.charAt(0).toUpperCase() + role.slice(1)} Support`,
      description: "Professional support and assistance.",
      icon: <FiHelpCircle size={22} />
    };
  };

  // Get role display name for header
  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: "Admins",
      doctor: "Doctors",
      police: "Officers"
    };
    return roleNames[role] || `${role.charAt(0).toUpperCase() + role.slice(1)}s`;
  };

  // Get online status text and color
  const getOnlineStatus = (userId) => {
    const isOnline = isUserOnline(userId);
    return {
      text: isOnline ? "Online" : "Offline",
      color: isOnline ? "text-green-500" : "text-gray-500",
      dotColor: isOnline ? "bg-green-500" : "bg-gray-500"
    };
  };

  if (!supportTeam || Object.keys(supportTeam).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading support team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {!selectedRole ? (
        // =================== Role Selection ===================
        <div className="flex flex-col items-center justify-center flex-grow px-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
              Who would you like to chat with?
            </h2>
            <div className="space-y-3">
              {roles && roles.map((role) => {
                const roleInfo = getRoleInfo(role);
                const roleUsers = supportTeam[role] || [];
                const onlineCount = roleUsers.filter(user => isUserOnline(user._id)).length;
                
                return (
                  <div
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className="flex items-center p-4 rounded-xl cursor-pointer transition bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <div className="mr-4 text-blue-600 dark:text-blue-300">
                      {roleInfo.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {roleInfo.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {roleInfo.description}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {roleUsers.length} available
                        </p>
                        {onlineCount > 0 && (
                          <p className="text-xs text-green-500">
                            {onlineCount} online
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // =================== Chat Layout ===================
        <div className="flex flex-grow overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setActiveUser(null);
                  setSearchTerm("");
                }}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400"
              >
                <FiArrowLeft /> Back
              </button>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {getRoleDisplayName(selectedRole)}
              </h2>
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              />
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const onlineStatus = getOnlineStatus(user._id);
                  return (
                    <div
                      key={user._id}
                      onClick={() => setActiveUser(user)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                        activeUser && activeUser._id === user._id
                          ? "bg-blue-100 dark:bg-blue-700"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={user.profilePic || assets.avatar_icon}
                          alt={user.fullname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {/* Online status dot */}
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${onlineStatus.dotColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                            {user.fullname}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.bio}
                        </p>
                        <p className={`text-xs ${onlineStatus.color}`}>
                          {onlineStatus.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No {getRoleDisplayName(selectedRole).toLowerCase()} found
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="w-2/4 flex flex-col bg-gray-50 dark:bg-gray-900">
            {activeUser ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={activeUser.profilePic || assets.avatar_icon}
                        alt={activeUser.fullname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {/* Online status dot */}
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getOnlineStatus(activeUser._id).dotColor}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {activeUser.fullname}
                      </p>
                      <p className={`text-xs ${getOnlineStatus(activeUser._id).color}`}>
                        {getOnlineStatus(activeUser._id).text}
                      </p>
                    </div>
                  </div>
                  <FiHelpCircle className="text-gray-500 dark:text-gray-300" />
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messagesDummyData.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.senderId === activeUser._id
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      {msg.text ? (
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
                            msg.senderId === activeUser._id
                              ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {msg.text}
                        </div>
                      ) : (
                        <img
                          src={msg.image}
                          alt="sent-media"
                          className="w-40 rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <FiSend />
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Select a user to start chatting
              </div>
            )}
          </div>

          {/* Right Info Panel */}
          {activeUser && (
            <div className="w-1/4 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={activeUser.profilePic || assets.avatar_icon}
                    alt="profile"
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                  {/* Online status dot */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getOnlineStatus(activeUser._id).dotColor}`} />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {activeUser.fullname}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeUser.bio}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  {activeUser.role.charAt(0).toUpperCase() + activeUser.role.slice(1)}
                </p>
                <p className={`text-xs mt-1 ${getOnlineStatus(activeUser._id).color}`}>
                  {getOnlineStatus(activeUser._id).text}
                </p>
              </div>
              <hr className="my-4 border-gray-300 dark:border-gray-700" />
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                Shared Files
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {messagesDummyData
                  .filter((m) => m.image)
                  .map((m, i) => (
                    <img
                      key={i}
                      src={m.image}
                      alt="shared"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSupportSelector;