import React, { useState, useEffect, useRef } from "react";
import {
  FiUser,
  FiSend,
  FiMessageSquare,
  FiCircle,
  FiMail,
  FiSearch,
  FiHelpCircle,
  FiPaperclip,
  FiSmile,
  FiArrowLeft,
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  const { fetchedUsers, loading, isUserOnline, onlineUsersCount } =
    useAdmin();
  const users = fetchedUsers || [];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: "admin",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format users with online status
  const formattedUsers = filteredUsers.map((user) => ({
    id: user._id,
    name: user.fullname,
    email: user.email,
    online: isUserOnline(user._id),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Main Chat Layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar - Users List */}
        <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Users
            </h2>
            <div className="flex items-center gap-2 text-sm bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
              <FiCircle className="text-green-600 dark:text-green-400 text-xs" />
              <span className="text-green-700 dark:text-green-400 font-semibold">
                {onlineUsersCount}
              </span>
              <span className="text-green-600 dark:text-green-300 text-xs">
                online
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none placeholder-gray-500 dark:placeholder-gray-400 border-0"
            />
          </div>

          {/* Users list */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-sm">Loading users...</p>
              </div>
            ) : formattedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <FiUser className="text-2xl mb-2 opacity-50" />
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              formattedUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                    selectedUser?.id === user.id
                      ? "bg-blue-100 dark:bg-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        selectedUser?.id === user.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        user.online ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium text-sm ${
                        selectedUser?.id === user.id
                          ? "text-blue-800 dark:text-blue-200"
                          : "text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {user.name}
                    </p>
                    <p
                      className={`text-xs ${
                        selectedUser?.id === user.id
                          ? "text-blue-600 dark:text-blue-300"
                          : "text-gray-500 dark:text-gray-400"
                      } truncate`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Middle Section - Chat Area */}
        {selectedUser ? (
          <div className="w-2/4 flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                      selectedUser.online ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {selectedUser.name}
                  </p>
                  <p className="text-xs text-green-500 dark:text-green-400">
                    {selectedUser.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <FiHelpCircle className="text-gray-500 dark:text-gray-300" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <FiMessageSquare className="text-4xl mb-3 opacity-50" />
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    No messages yet
                  </p>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Start a conversation with {selectedUser.name}.<br />
                    Send a message to get started.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.sender === "admin"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      }`}
                    >
                      {msg.text}
                      <div
                        className={`text-xs mt-1 ${
                          msg.sender === "admin"
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
                        } text-right`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3">
             
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none placeholder-gray-500 dark:placeholder-gray-400 border-0"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={16} />
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="w-2/4 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            <FiMessageSquare className="text-6xl mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              Welcome to Messages
            </h3>
            <p className="text-sm text-center">
              Select a user from the sidebar
              <br />
              to start chatting
            </p>
          </div>
        )}

        {/* Right Sidebar - User Profile */}
        {selectedUser && (
          <div className="w-1/4 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl mb-3">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                {selectedUser.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedUser.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedUser.online ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedUser.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <hr className="my-4 border-gray-300 dark:border-gray-700" />

            <div>
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
                User Information
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    User ID
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 font-mono text-xs break-all bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
                    {selectedUser.id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Email
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 truncate">
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedUser.online ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">
                      {selectedUser.online
                        ? "Active now"
                        : "Last seen recently"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
