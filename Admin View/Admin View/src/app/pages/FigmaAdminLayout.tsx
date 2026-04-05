import { Outlet, Link, useLocation } from 'react-router';
import { Sun, Moon,LayoutDashboard, LogOut ,  Drone  , Map, AlertTriangle, Activity, Bell , Users} from "lucide-react";
import { useTheme } from "../context/ThemeContext.tsx";
import { useState } from "react";
//import { Button } from "../components/Button";


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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#333]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const textSecondary = isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500";
  const sidebarBg = isDark ? "bg-[#1a1a1a]" : "bg-gray-100";
  const menuItemBg = isDark ? "hover:bg-[rgba(255,255,255,0.05)]" : "hover:bg-gray-200";
  const menuItemActiveBg = isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-300";
  const borderColor = isDark ? "border-[rgba(255,255,255,0.15)]" : "border-gray-300";

  /*Dummy notifications*/
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Drone Sighting", desc: "Drone D-03 detected near boundary.", time: "2m ago", unread: true },
    { id: 2, title: "Battery Warning", desc: "Alpha Watcher is below 20% battery.", time: "15m ago", unread: true },
    { id: 3, title: "Zone Update", desc: "Server Room Zone coordinates modified.", time: "1h ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className={`flex h-screen ${bgColor} ${textColor}`}>
      {/* Left Sidebar */}
      <aside
          className={`${isCollapsed ? "w-26" : "w-60"} relative ${sidebarBg} border-r ${borderColor} flex flex-col transition-all duration-300 ease-in-out`}
      >

        {/* Header Section (Contains Profile and Toggle Button) */}
        <div className={`flex items-center justify-between h-[72px] px-4 border-b ${borderColor} overflow-hidden`}>

          {/* Admin Profile (Fades out and hides when collapsed) */}
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full ${isDark ? "bg-white" : "bg-black"} flex items-center justify-center`}>
              <span className={`text-sm font-bold ${isDark ? "text-black" : "text-white"}`}>A</span>
            </div>
            <span className="font-medium ml-3 whitespace-nowrap">Admin</span>
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
                to="/logout"
                title={isCollapsed ? "Logout" : ""}
                className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isDark ? "hover:bg-red-500/10 text-red-400" : "hover:bg-red-50 text-red-500"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className={`h-18 border-b ${borderColor} flex items-center justify-between px-6`}>
          <h2 className={`text-sm ${textSecondary}`}>Dashboards</h2>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${menuItemBg} hover:opacity-60 transition-opacity`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
