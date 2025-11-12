import React, { useState, useEffect, useRef } from "react";
import {
  FiUser,
  FiSend,
  FiMessageSquare,
  FiCircle,
  FiSearch,
  FiHelpCircle,
  FiX,
  FiImage,
  FiMenu,
  FiInfo,
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import axios from "axios";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    fetchedUsers,
    loading,
    isUserOnline,
    onlineUsersCount,
    sendMessage,
    messagesMap,
    admin,
    fetchUser,
    setMessagesMap,
    backendUrl,
  } = useAdmin();

  const users = fetchedUsers || [];
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch messages when activeUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !admin) return;

      try {
        const res = await axios.get(
          `${backendUrl}/api/messages/${admin._id}/${selectedUser.id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          // Update messagesMap with the fetched messages
          setMessagesMap((prev) => ({
            ...prev,
            [selectedUser.id]: res.data.data,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, admin, backendUrl]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll whenever messages for selectedUser change
  const currentMessages = selectedUser
    ? messagesMap[selectedUser.id] || []
    : [];
  useEffect(scrollToBottom, [currentMessages]);

  // Close mobile overlays when user is selected
  useEffect(() => {
    if (selectedUser) {
      setIsSidebarOpen(false);
    }
  }, [selectedUser]);

  // Send new message
  const handleSend = () => {
    if (!newMessage.trim() && !file) return;
    if (!selectedUser) return;

    sendMessage(selectedUser.id, newMessage, file);
    setNewMessage("");
    setFile(null);
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

  // Format users for UI
  const formattedUsers = filteredUsers.map((user) => ({
    id: user._id,
    name: user.fullname,
    email: user.email,
    online: isUserOnline(user._id),
  }));

  return (
    <div className="min-h-screen ">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FiMenu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Messages
          </h1>
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
            <FiCircle className="text-green-600 dark:text-green-400 text-xs" />
            <span className="text-green-700 dark:text-green-400 font-semibold text-sm">
              {onlineUsersCount}
            </span>
          </div>
        </div>

        {selectedUser && (
          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FiInfo size={20} />
          </button>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Users
                </h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Search bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none placeholder-gray-500 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Users list */}
            <div className="p-4 space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto">
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
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      selectedUser?.id === user.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg ${
                          selectedUser?.id === user.id
                            ? "bg-blue-600 text-white"
                            : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
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
                        className={`font-semibold text-sm ${
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
        </div>
      )}

      {/* Mobile Profile Overlay */}
      {isProfileOpen && selectedUser && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                User Info
              </h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                      selectedUser.online ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-xl mb-2">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {selectedUser.email}
                </p>

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedUser.online ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedUser.online ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  User Information
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                      User ID
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 font-mono text-xs break-all bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
                      {selectedUser.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                      Status
                    </p>
                    <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedUser.online ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {selectedUser.online
                          ? "Active now"
                          : "Last seen recently"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen lg:h-[calc(100vh-2rem)] m-4 rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700">
          {/* Users Sidebar - Hidden on mobile */}
          <div className="hidden lg:flex w-full md:w-1/4 lg:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                Users
              </h2>
              <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-3 py-2 rounded-full">
                <FiCircle className="text-green-600 dark:text-green-400 text-xs" />
                <span className="text-green-700 dark:text-green-400 font-semibold text-sm">
                  {onlineUsersCount}
                </span>
                <span className="text-green-600 dark:text-green-300 text-xs">
                  online
                </span>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative mb-5">
              <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none placeholder-gray-500 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Users list */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-sm">Loading users...</p>
                </div>
              ) : formattedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  <FiUser className="text-3xl mb-3 opacity-50" />
                  <p className="text-sm text-center">No users found</p>
                </div>
              ) : (
                formattedUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                      selectedUser?.id === user.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
                    }`}
                  >
                    <div className="relative ">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xs ${
                          selectedUser?.id === user.id
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                            : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
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
                        className={`font-semibold text-sm ${
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
                        } truncate mt-1`}
                      >
                        {user.email}
                      </p>
                      <p
                        className={`text-xs font-medium mt-1 ${
                          user.online ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {user.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 w-10 flex flex-col bg-gray-50 dark:bg-gray-900">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-lg">
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
                      <p
                        className={`text-sm font-medium ${
                          selectedUser.online
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {selectedUser.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900 no-scrollbar">
                  {currentMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <FiMessageSquare className="text-5xl mb-4 opacity-50" />
                      <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                        No messages yet
                      </p>
                      <p className="text-sm text-center text-gray-600 dark:text-gray-400 max-w-md">
                        Start a conversation with {selectedUser.name}. Send a
                        message to begin chatting.
                      </p>
                    </div>
                  ) : (
                    currentMessages.map((msg) => (
                      <div
                        key={msg._id || msg.id}
                        className={`flex ${
                          msg.senderId === admin?._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            msg.senderId === admin?._id
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                              : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-600"
                          }`}
                        >
                          {msg.text}
                          <div
                            className={`text-xs mt-2 ${
                              msg.senderId === admin?._id
                                ? "text-blue-100"
                                : "text-gray-500 dark:text-gray-400"
                            } text-right text-xs`}
                          >
                            {new Date(
                              msg.createdAt || msg.timestamp
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  {file && (
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl mb-3">
                      <FiImage className="text-blue-500" />
                      <span className="text-sm text-blue-600 dark:text-blue-300 flex-1 truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => setFile(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 w-5 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none placeholder-gray-500 dark:placeholder-gray-400 border-0 focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <input
                      type="file"
                      id="file-input"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                      accept="image/*"
                    />
                    <label
                      htmlFor="file-input"
                      className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <FiImage size={20} />
                    </label>

                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim() && !file}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
                    >
                      <FiSend size={18} />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 p-8">
                <div className="text-center max-w-md">
                  <FiMessageSquare className="text-6xl mb-6 opacity-50 mx-auto" />
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Welcome to Messages
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Select a user from the sidebar to start chatting. You can
                    see online users and their availability status.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          {selectedUser && (
            <div className="hidden lg:flex w-1/4 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
              <div className="w-full">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                        selectedUser.online ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-xl mb-2">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedUser.online ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedUser.online ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100 text-lg">
                    User Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 font-medium">
                        USER ID
                      </p>
                      <p className="text-gray-800 dark:text-gray-200 font-mono text-xs break-all bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
                        {selectedUser.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 font-medium">
                        EMAIL
                      </p>
                      <p className="text-gray-800 dark:text-gray-200 text-sm p-3 bg-gray-100 dark:bg-gray-700 rounded-xl truncate">
                        {selectedUser.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 font-medium">
                        STATUS
                      </p>
                      <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            selectedUser.online ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                          {selectedUser.online
                            ? "Active now"
                            : "Last seen recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
