import React, { useState } from "react";
import {
  FiShield,
  FiHeart,
  FiAlertCircle,
  FiSearch,
  FiSend,
  FiHelpCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { assets, userDummyData, messagesDummyData } from "../../assets/assets";

const ChatSupportSelector = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeUser, setActiveUser] = useState(userDummyData[0]);
  const [message, setMessage] = useState("");

  const options = [
    {
      id: "admin",
      name: "Admin Support",
      description: "General inquiries and safety support.",
      icon: <FiShield size={22} />,
    },
    {
      id: "doctor",
      name: "Medical Doctor",
      description: "For medical help and health emergencies.",
      icon: <FiHeart size={22} />,
    },
    {
      id: "police",
      name: "Police Officer",
      description: "For reporting crime or immediate danger.",
      icon: <FiAlertCircle size={22} />,
    },
  ];

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
              {options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedRole(option.id)}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition ${
                    selectedRole === option.id
                      ? "bg-blue-100 dark:bg-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="mr-4 text-blue-600 dark:text-blue-300">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // =================== Chat Layout ===================
        <div className="flex flex-grow overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              {/* Back button */}
              <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400"
              >
                <FiArrowLeft /> Back
              </button>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {selectedRole === "admin"
                  ? "Admins"
                  : selectedRole === "doctor"
                  ? "Doctors"
                  : "Officers"}
              </h2>
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search user..."
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
              />
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {userDummyData.map((user, index) => (
                <div
                  key={index}
                  onClick={() => setActiveUser(user)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                    activeUser._id === user._id
                      ? "bg-blue-100 dark:bg-blue-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={user.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="w-2/4 flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <img
                  src={activeUser.profilePic}
                  alt={activeUser.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {activeUser.fullName}
                  </p>
                  <p className="text-xs text-green-500">Online</p>
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
          </div>

          {/* Right Info Panel */}
          <div className="w-1/4 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col items-center text-center">
              <img
                src={activeUser.profilePic}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                {activeUser.fullName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeUser.bio}
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
        </div>
      )}
    </div>
  );
};

export default ChatSupportSelector;
