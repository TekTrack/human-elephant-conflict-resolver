import { Outlet, Link, useLocation } from 'react-router';
import { Sun, Moon,LayoutDashboard, LogOut ,  Drone   , Map, AlertTriangle, Activity, Bell , Users} from "lucide-react";
import { useTheme } from "../context/ThemeContext.tsx";
import React, { useEffect, useState } from "react";
import { useMapTrigger } from '../context/MapTriggerContext.tsx';
import Auth from '../utilities/Auth.js';
import type { router } from '../routes.ts';
import { useNavigate } from 'react-router';
//import { Button } from "../components/Button";

interface Notification {
  id: number;
  message : string;
  type : string;
  unread: boolean;
  time: string | number; // You can adjust this type based on your timestamp format
}

const menuItems = [
  { label: "Overview", path: "/", icon: <LayoutDashboard size={30} /> },
  { label: "Geofencing", path: "/geofencing", icon: <Map size={30} /> },
  { label: "Sighting Alerts", path: "/sighting-alerts", icon: <AlertTriangle size={30} /> },
  { label: "Live Monitor", path: "/live-monitor", icon: <Activity size={30} /> },
  { label: "Drone Map", path: "/alert-map", icon: <Drone   size={30} /> },
  { label: "User Directory", path: "/user-directory", icon: <Users size={30} /> },


];

export function FigmaAdminLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { mapTrigger, BASE_URL } = useMapTrigger();

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#333]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const textSecondary = isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500";
  const sidebarBg = isDark ? "bg-[#1a1a1a]" : "bg-gray-100";
  const menuItemBg = isDark ? "hover:bg-[rgba(255,255,255,0.05)]" : "hover:bg-gray-200";
  const menuItemActiveBg = isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-300";
  const borderColor = isDark ? "border-[rgba(255,255,255,0.15)]" : "border-gray-300";


  const formatSmartTime = (timestamp: number | string | Date) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return past.toLocaleDateString([], { month: 'short', day: '2-digit' });
  };


  /*Dummy notifications*/
  const fetchNotifications = async (zoneId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/allnotifications?zoneId=${zoneId}`,
        {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      const result: Notification[] = data.map((item: any) => ({
        id: item.id,
        title: item.type, 
        message: item.message,
        unread: true, // You can adjust this based on your data structure
        time: formatSmartTime(item.time ||Date.now()), 
      }));
      setNotifications(result);
    }catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

useEffect(() => {
    fetchNotifications(0);
    const intervalId = setInterval(() => {
    fetchNotifications(0);
  }, 60000);
  return () => clearInterval(intervalId);
}, [mapTrigger]);

  const [notifications, setNotifications] = useState<Notification[]>([
    // { id: 1, title: "New Drone Sighting", desc: "Drone D-03 detected near boundary.", time: "2m ago", unread: true },
    // { id: 2, title: "Battery Warning", desc: "Alpha Watcher is below 20% battery.", time: "15m ago", unread: true },
    // { id: 3, title: "Zone Update", desc: "Server Room Zone coordinates modified.", time: "1h ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;


  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteAll= async()=>{
    try{
      const res= await fetch(`${BASE_URL}/allnotifications`,{
        method: "DELETE",
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      fetchNotifications(0);
    }catch(err){
      console.error(err);
    }
  }

  return (
    <div className={`flex h-screen ${bgColor} ${textColor}`}>
      {/* Left Sidebar */}
      <aside
          className={`${isCollapsed ? "w-26" : "w-60"} relative ${sidebarBg} border-r ${borderColor} flex flex-col transition-all duration-300 ease-in-out`}
      >

        {/* Header Section (Contains Profile and Toggle Button) */}
        <div className={`flex items-center justify-between h-[72px] px-4 border-b ${borderColor} overflow-hidden`}>

          {/* Admin Profile (Fades out and hides when collapsed) */}
          {/* <div className={`flex items-center transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
            <button
              onClick={() => { router.navigate("/AdminEditPage") }}
            >
            <div className={`shrink-0 w-8 h-8 rounded-full ${isDark ? "bg-white" : "bg-black"} flex items-center justify-center`}>
              <span className={`text-sm font-bold ${isDark ? "text-black" : "text-white"}`}>A</span>
            </div>
            </button>
            <span className="font-medium ml-3 whitespace-nowrap">Admin</span>
          </div> */}
          {/* Admin Profile Container */}
<div className={`flex items-center transition-all duration-300 ease-in-out ${isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"} overflow-hidden`}>
  
  <button
    onClick={() => navigate("/admin-edit")}
    className="focus:outline-none hover:opacity-80 transition-opacity cursor-pointer"
  >
    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-white" : "bg-black"}`}>
      <span className={`text-sm font-bold ${isDark ? "text-black" : "text-white"}`}>A</span>
    </div>
  </button>

  {/* Text Label - Wraps to prevent layout shifts during collapse */}
  <div className="ml-3 overflow-hidden">
    <span className="font-medium whitespace-nowrap">Admin</span>
  </div>
</div>

          {/* Toggle Button (Hamburger when closed, Chevron when open) */}
          <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 ${isDark ? "hover:bg-gray-800 text-white" : "text-gray-600"} transition-colors ${isCollapsed ? "mx-auto w-full" : ""}`}
          >
            {isCollapsed ? (
                // Hamburger Icon (Matches your uploaded image)
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
            ) : (
                // Collapse Chevron (Allows user to slide it back left)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
                <Link
                    key={item.path}
                    to={item.path}
                    title={isCollapsed ? item.label : ""}
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                        isActive ? menuItemActiveBg : menuItemBg
                    } ${isCollapsed ? "justify-center px-0" : ""}`}
                >
                  {/* 1. Always show the icon */}
                  <div className={`${isCollapsed ? "mr-0" : "mr-3"}`}>
                    {item.icon}
                  </div>

                  {/* 2. Hide the label smoothly when collapsed */}
                  <span className={`text-sm whitespace-nowrap transition-all duration-300 ${
                      isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
                  }`}>
            {item.label}
          </span>
                </Link>
            );
          })}


          { /*logout button*/}
          <div className={`p-4 py-100 border-t ${borderColor} shrink-0`}>
              <Link
              onClick={Auth.logout}
              title={isCollapsed ? "Logout" : ""}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${isDark ? "hover:bg-red-500/10 text-red-400" : "hover:bg-red-50 text-red-500"} ${isCollapsed ? "justify-center px-0" : ""}`} to={''}              >
                <div className={`${isCollapsed ? "mr-0" : "mr-3"}`}>
                  <LogOut size={20} />
                </div>
                <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
                }`}>
                Logout
              </span>
              </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Top Header */}
        <header className={`h-[72px] border-b ${borderColor} flex items-center justify-between px-6 shrink-0`}>
          <h2 className={`text-sm ${textSecondary} font-medium tracking-wide `}>
            Dashboard
          </h2>

          <div className="flex items-center gap-2">
            {/* Notification Bell Button */}
            <button
                onClick={() => setShowNotifications(true)}
                className={`relative p-2 rounded-lg ${menuItemBg} transition-colors`}
                aria-label="View notifications"
            >
              <Bell className={`w-5 h-5 ${isDark ? "text-white" : "text-gray-700"}`} />

              {/* Red Dot Indicator (Only shows if unreadCount > 0) */}
              {unreadCount > 0 && (
                  <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 ${isDark ? "border-[#333]" : "border-white"}`}></span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${menuItemBg} hover:opacity-80 transition-opacity`}
                aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 0" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-transparent">
          <Outlet />
        </main>
      </div>

      {/* ── Slide-Over Notification Panel ── */}

      {/* 1. Invisible Backdrop (Clicks outside close the panel) */}
      {showNotifications && (
          <div
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-40 transition-opacity"
              onClick={() => setShowNotifications(false)}
          />
      )}

      {/* 2. The Sliding Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 md:w-96 ${sidebarBg} border-l ${borderColor} shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
              showNotifications ? "translate-x-0" : "translate-x-full"
          }`}>
        {/* Drawer Header */}
        <div className={`flex items-center justify-between p-5 border-b ${borderColor} shrink-0`}>
          <div>
            <h3 className="font-semibold text-lg">Notifications</h3>
            <p className={`text-xs ${textSecondary}`}>{unreadCount} unread messages</p>
          </div>
          <button
              onClick={() => setShowNotifications(false)}
              className={`p-2 rounded-lg ${menuItemBg} transition-colors`}
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content (Scrollable list of alerts) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {notifications.map((notification) => (
              <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                      notification.unread
                          ? (isDark ? "bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.2)]" : "bg-blue-50 border-blue-100")
                          : (isDark ? "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)]" : "bg-white border-gray-100")
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm">{notification.message}</h4>
                  {notification.unread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                  )}
                </div>
                <p className={`text-xs mb-2 ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>
                  {notification.type}
                </p>
                <span className={`text-[10px] uppercase font-bold ${textSecondary}`}>
                {notification.time}
              </span>
              </div>
          ))}

          {notifications.length === 0 && (
              <div className={`text-center py-10 text-sm ${textSecondary}`}>
                You're all caught up!
              </div>
          )}
        </div>

        {/* Drawer Footer */}
        {notifications.length > 0 && (
            <div className={`p-4 border-t ${borderColor} shrink-0 flex gap-3`}>

              {/* Mark Read Button */}
              <button
                  onClick={markAllRead}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDark ? "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white" : "bg-gray-200 hover:bg-gray-300 text-black"
                  }`}
              >
                Mark Read
              </button>

              {/* Delete All Button */}
              <button
                  onClick={deleteAll}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDark ? "bg-red-500/10 hover:bg-red-500/20 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
              >
                Delete All
              </button>

            </div>
        )}
      </div>

    </div>
  );
}

