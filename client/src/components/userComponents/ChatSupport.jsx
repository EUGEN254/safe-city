import React, { useState, useEffect, useRef } from "react";
import {
  FiShield,
  FiHeart,
  FiAlertCircle,
  FiSearch,
  FiSend,
  FiHelpCircle,
  FiArrowLeft,
  FiX,
  FiImage,
  FiMenu,
} from "react-icons/fi";
import axios from "axios";
import { assets } from "../../assets/assets";
import { useSafeCity } from "../../context/SafeCity";

const ChatSupport = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const scrollRef = useRef();

  const {
    supportTeam,
    user,
    fetchSupportTeam,
    backendUrl,
    socket,
    isUserOnline,
    messagesMap,
    setMessagesMap,
  } = useSafeCity();

  // Extract roles from supportTeam
  const roles = Object.keys(supportTeam || {});

  // Fetch support team
  useEffect(() => {
    fetchSupportTeam();
  }, []);

  // Fetch messages when activeUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeUser || !user) return;
      try {
        const res = await axios.get(
          `${backendUrl}/api/messages/${user._id}/${activeUser._id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setMessagesMap((prev) => ({
            ...prev,
            [activeUser._id]: res.data.data,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [activeUser, user]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesMap[activeUser?._id]]);

  // Set first user when role is selected
  useEffect(() => {
    if (selectedRole && supportTeam[selectedRole]?.length > 0) {
      setActiveUser(supportTeam[selectedRole][0]);
    }
  }, [selectedRole, supportTeam]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!message.trim() && !file) return;
    if (!activeUser || !user) return;

    const formData = new FormData();
    formData.append("senderId", user._id);
    formData.append("receiverId", activeUser._id);
    formData.append("text", message);
    if (file) formData.append("image", file);

    try {
      const res = await axios.post(
        `${backendUrl}/api/messages/send`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        // Update local messages
        setMessagesMap((prev) => ({
          ...prev,
          [activeUser._id]: [...(prev[activeUser._id] || []), res.data.data],
        }));

        // Emit via socket
        socket?.emit("send-message", {
          toUserId: activeUser._id,
          message: res.data.data,
        });

        setMessage("");
        setFile(null);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle key press for sending message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter users by search term
  const filteredUsers =
    selectedRole && supportTeam[selectedRole]
      ? supportTeam[selectedRole].filter(
          (u) =>
            u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.bio && u.bio.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : [];

  const getRoleInfo = (role) => {
    const roleConfig = {
      admin: {
        name: "Admin Support",
        description: "General inquiries and safety support.",
        icon: <FiShield size={22} />,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
      },
      doctor: {
        name: "Medical Doctor",
        description: "Medical help and emergencies.",
        icon: <FiHeart size={22} />,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
      },
      police: {
        name: "Police Officer",
        description: "Report crime or danger.",
        icon: <FiAlertCircle size={22} />,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
      },
    };

    // Return configured role or default for new roles
    return roleConfig[role] || {
      name: `${role.charAt(0).toUpperCase() + role.slice(1)} Support`,
      description: "Professional support and assistance.",
      icon: <FiHelpCircle size={22} />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    };
  };

  const getRoleDisplayName = (role) => {
    const roleNames = { 
      admin: "Admins", 
      doctor: "Doctors", 
      police: "Officers" 
    };
    return roleNames[role] || `${role.charAt(0).toUpperCase() + role.slice(1)}s`;
  };

  const getOnlineStatus = (userId) => {
    const online = isUserOnline(userId);
    return {
      text: online ? "Online" : "Offline",
      color: online ? "text-green-500" : "text-gray-500",
      dotColor: online ? "bg-green-500" : "bg-gray-500",
    };
  };

  if (!supportTeam || Object.keys(supportTeam).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading support team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-inherit">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <FiMenu size={20} />
        </button>
        
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          {selectedRole ? getRoleDisplayName(selectedRole) : "Chat Support"}
        </h1>

        {activeUser && (
          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <FiHelpCircle size={20} />
          </button>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Support Teams</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            {/* Mobile sidebar content */}
            {!selectedRole ? (
              <div className="p-4 space-y-3">
                {roles.map((role) => {
                  const roleInfo = getRoleInfo(role);
                  const roleUsers = supportTeam[role] || [];
                  const onlineCount = roleUsers.filter((u) => isUserOnline(u._id)).length;
                  return (
                    <div
                      key={role}
                      onClick={() => {
                        setSelectedRole(role);
                        setIsSidebarOpen(false);
                      }}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition ${roleInfo.bgColor} hover:opacity-80`}
                    >
                      <div className={`mr-4 ${roleInfo.color}`}>{roleInfo.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{roleInfo.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{roleInfo.description}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-400 dark:text-gray-500">{roleUsers.length} available</p>
                          {onlineCount > 0 && <p className="text-xs text-green-500">{onlineCount} online</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
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
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{getRoleDisplayName(selectedRole)}</h2>
                </div>
                
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

                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {filteredUsers.map((u) => {
                    const status = getOnlineStatus(u._id);
                    return (
                      <div
                        key={u._id}
                        onClick={() => {
                          setActiveUser(u);
                          setIsSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                          activeUser?._id === u._id ? "bg-blue-100 dark:bg-blue-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="relative">
                          <img src={u.profilePic || assets.avatar_icon} alt={u.fullname} className="w-10 h-10 rounded-full object-cover" />
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${status.dotColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{u.fullname}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.bio || "No bio available"}</p>
                          <p className={`text-xs ${status.color}`}>{status.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Profile Overlay */}
      {isProfileOpen && activeUser && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 dark:text-white">Profile</h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img src={activeUser.profilePic || assets.avatar_icon} alt="profile" className="w-24 h-24 rounded-full object-cover" />
                  <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getOnlineStatus(activeUser._id).dotColor}`} />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{activeUser.fullname}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activeUser.bio || "No bio available"}</p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                  {activeUser.role}
                </p>
                <p className={`text-sm mt-2 ${getOnlineStatus(activeUser._id).color}`}>
                  {getOnlineStatus(activeUser._id).text}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {!selectedRole ? (
          <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                Who would you like to chat with?
              </h2>
              <div className="space-y-4">
                {roles.map((role) => {
                  const roleInfo = getRoleInfo(role);
                  const roleUsers = supportTeam[role] || [];
                  const onlineCount = roleUsers.filter((u) => isUserOnline(u._id)).length;
                  return (
                    <div
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`flex items-center p-5 rounded-2xl cursor-pointer transition-all duration-300 ${roleInfo.bgColor} hover:scale-105 hover:shadow-lg border border-transparent hover:border-opacity-30`}
                    >
                      <div className={`mr-4 ${roleInfo.color}`}>{roleInfo.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{roleInfo.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{roleInfo.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {roleUsers.length} {roleUsers.length === 1 ? 'member' : 'members'}
                          </p>
                          {onlineCount > 0 && (
                            <p className="text-xs text-green-500 font-medium">{onlineCount} online</p>
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
          <div className="flex h-screen lg:h-[calc(100vh-2rem)] m-4 rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:flex w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    setActiveUser(null);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  <FiArrowLeft /> Back
                </button>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {getRoleDisplayName(selectedRole)}
                </h2>
              </div>
              
              <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const status = getOnlineStatus(u._id);
                    return (
                      <div
                        key={u._id}
                        onClick={() => setActiveUser(u)}
                        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                          activeUser?._id === u._id 
                            ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                        }`}
                      >
                        <div className="relative">
                          <img 
                            src={u.profilePic || assets.avatar_icon} 
                            alt={u.fullname} 
                            className="w-12 h-12 rounded-full object-cover" 
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${status.dotColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm dark:text-gray-100 truncate">{u.fullname}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{u.bio || "No bio available"}</p>
                          <p className={`text-xs font-medium mt-1 ${status.color}`}>{status.text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No {getRoleDisplayName(selectedRole).toLowerCase()} found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 w-10 flex flex-col bg-gray-50 dark:bg-gray-900">
              {activeUser ? (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={activeUser.profilePic || assets.avatar_icon} 
                          alt={activeUser.fullname} 
                          className="w-12 h-12 rounded-full object-cover" 
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getOnlineStatus(activeUser._id).dotColor}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{activeUser.fullname}</p>
                        <p className={`text-sm ${getOnlineStatus(activeUser._id).color}`}>
                          {getOnlineStatus(activeUser._id).text}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
                    {(messagesMap[activeUser._id] || []).map((msg) => (
                      <div key={msg._id} ref={scrollRef} className={`flex ${msg.senderId === activeUser._id ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          msg.senderId === activeUser._id 
                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-600" 
                            : "bg-blue-500 text-white shadow-md"
                        }`}>
                          {msg.text ? (
                            <p className="break-words text-xs">{msg.text}</p>
                          ) : msg.image ? (
                            <img src={msg.image} alt="sent-media" className="w-full rounded-lg max-w-xs" />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      {file && (
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                          <FiImage className="text-blue-500" />
                          <span className="text-sm text-blue-600 dark:text-blue-300 truncate max-w-xs">
                            {file.name}
                          </span>
                          <button
                            onClick={() => setFile(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none transition-all focus:ring-2 focus:ring-blue-500"
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
                        onClick={handleSendMessage}
                        disabled={!message.trim() && !file}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
                      >
                        <FiSend />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8">
                  <div className="text-center">
                    <FiHelpCircle size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">Select a user to start chatting</p>
                    <p className="text-sm mt-2">Choose from the sidebar to begin your conversation</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Hidden on mobile */}
            {activeUser && (
              <div className="hidden lg:flex w-1/4 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col items-center text-center w-full">
                  <div className="relative mb-6">
                    <img 
                      src={activeUser.profilePic || assets.avatar_icon} 
                      alt="profile" 
                      className="w-24 h-24 rounded-full object-cover" 
                    />
                    <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getOnlineStatus(activeUser._id).dotColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{activeUser.fullname}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{activeUser.bio || "No bio available"}</p>
                  <p className={`text-sm font-medium ${getOnlineStatus(activeUser._id).color}`}>
                    {getOnlineStatus(activeUser._id).text}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSupport;