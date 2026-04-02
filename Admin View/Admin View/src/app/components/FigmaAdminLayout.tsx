import { Outlet, Link, useLocation } from 'react-router';
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import svgPaths from "../../imports/svg-jvw402qc7a";




const menuItems = [
  { label: "Overview", path: "/" },
  { label: "Sighting Alerts", path: "/sighting-alerts" },
  { label: "Live Monitor", path: "/live-monitor" },
  { label: "Alert Map", path: "/alert-map" },
  { label: "User Directory", path: "/user-directory" },
  { label: "Geofencing", path: "/geofencing" },
];

export function FigmaAdminLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#333]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const textSecondary = isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500";
  const sidebarBg = isDark ? "bg-[#1a1a1a]" : "bg-gray-100";
  const menuItemBg = isDark ? "hover:bg-[rgba(255,255,255,0.05)]" : "hover:bg-gray-200";
  const menuItemActiveBg = isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-300";
  const borderColor = isDark ? "border-[rgba(255,255,255,0.15)]" : "border-gray-300";

  return (
    <div className={`flex h-screen ${bgColor} ${textColor}`}>
      {/* Left Sidebar */}
      <aside className={`w-60 ${sidebarBg} border-r ${borderColor} flex flex-col`}>
        <div className="p-6 border-b ${borderColor}">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${isDark ? "bg-white" : "bg-black"} flex items-center justify-center`}>
              <span className={`text-xs ${isDark ? "text-black" : "text-white"}`}>A</span>
            </div>
            <span className="font-medium">Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2.5 rounded-lg transition-colors ${
                  isActive ? menuItemActiveBg : menuItemBg
                }`}
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className={`h-16 border-b ${borderColor} flex items-center justify-between px-6`}>
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

      {/* Right Sidebar */}
      <aside className={`w-[280px] border-l ${borderColor} p-4 overflow-auto space-y-6`}>
        {/* Notifications */}
        <div className="space-y-2">
          <h3 className="text-sm px-1 py-2">Notifications</h3>
          
          <div className="flex gap-2 p-2 rounded-lg">
            <div className={`${isDark ? "bg-[#edeefc]" : "bg-[#edeefc]"} p-1 rounded-lg shrink-0`}>
              <div className="w-4 h-4">
                <svg className="w-full h-full" fill="none" viewBox="0 0 13 13.5012">
                  <path d={svgPaths.p26ee580} fill="black" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5">You fixed a bug.</p>
              <p className={`text-xs leading-4 ${textSecondary}`}>Just now</p>
            </div>
          </div>

          <div className="flex gap-2 p-2 rounded-lg">
            <div className={`${isDark ? "bg-[#e6f1fd]" : "bg-[#e6f1fd]"} p-1 rounded-lg shrink-0`}>
              <div className="w-4 h-4">
                <svg className="w-full h-full" fill="none" viewBox="0 0 13.0125 12.5131">
                  <path d={svgPaths.p26dbbd80} fill="black" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5">New user registered.</p>
              <p className={`text-xs leading-4 ${textSecondary}`}>59 minutes ago</p>
            </div>
          </div>

          <div className="flex gap-2 p-2 rounded-lg">
            <div className={`${isDark ? "bg-[#edeefc]" : "bg-[#edeefc]"} p-1 rounded-lg shrink-0`}>
              <div className="w-4 h-4">
                <svg className="w-full h-full" fill="none" viewBox="0 0 13 13.5012">
                  <path d={svgPaths.p26ee580} fill="black" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5">You fixed a bug.</p>
              <p className={`text-xs leading-4 ${textSecondary}`}>12 hours ago</p>
            </div>
          </div>

          <div className="flex gap-2 p-2 rounded-lg">
            <div className={`${isDark ? "bg-[#e6f1fd]" : "bg-[#e6f1fd]"} p-1 rounded-lg shrink-0`}>
              <div className="w-4 h-4">
                <svg className="w-full h-full" fill="none" viewBox="0 0 15.0041 10.8169">
                  <path d={svgPaths.p25c95f00} fill="black" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5">Andi Lane subscribed to you.</p>
              <p className={`text-xs leading-4 ${textSecondary}`}>Today, 11:59 AM</p>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="space-y-2">
          <h3 className="text-sm px-1 py-2">Activities</h3>
          
          <div className="flex gap-2 p-2 rounded-lg">
            <div className={`${isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-200"} rounded-full w-6 h-6 shrink-0 overflow-hidden`}>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5">Changed the style.</p>
              <p className={`text-xs leading-4 ${textSecondary}`}>Just now</p>
            </div>
          </div>

          <div className="flex gap-2 p-2 rounded-lg">
            <div className={`${isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-200"} rounded-full w-6 h-6 shrink-0 overflow-hidden`}>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5">Released a new version.</p>
              <p className={`text-xs leading-4 ${textSecondary}`}>59 minutes ago</p>
            </div>
          </div>

          <div className="flex gap-2 p-2 rounded-lg">
            <div className={`${isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-200"} rounded-full w-6 h-6 shrink-0 overflow-hidden`}>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5">Submitted a bug.</p>
              <p className={`text-xs leading-4 ${textSecondary}`}>12 hours ago</p>
            </div>
          </div>

          <div className="flex gap-2 p-2 rounded-lg">
            <div className={`${isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-200"} rounded-full w-6 h-6 shrink-0 overflow-hidden`}>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5">Modified A data in Page X.</p>
              <p className={`text-xs leading-4 ${textSecondary}`}>Today, 11:59 AM</p>
            </div>
          </div>

          <div className="flex gap-2 p-2 rounded-lg">
            <div className={`${isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-200"} rounded-full w-6 h-6 shrink-0 overflow-hidden`}>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5">Deleted a page in Project X.</p>
              <p className={`text-xs leading-4 ${textSecondary}`}>Feb 2, 2026</p>
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div className="space-y-2">
          <h3 className="text-sm px-1 py-2">Contacts</h3>
          
          {/*{[*/}
          {/*  { name: "Natali Craig", img: imgContact1 },*/}
          {/*  { name: "Drew Cano", img: imgContact2 },*/}
          {/*  { name: "Andi Lane", img: imgContact3 },*/}
          {/*  { name: "Koray Okumus", img: imgContact4 },*/}
          {/*  { name: "Kate Morrison", img: imgContact5 },*/}
          {/*  { name: "Melody Macy", img: imgContact6 },*/}
          {/*].map((contact, i) => (*/}
          {/*  <div key={i} className="flex gap-2 p-2 rounded-lg hover:bg-opacity-50 cursor-pointer">*/}
          {/*    <div className={`${isDark ? "bg-[rgba(255,255,255,0.1)]" : "bg-gray-200"} rounded-full w-6 h-6 shrink-0 overflow-hidden`}>*/}
          {/*      <img src={contact.img} alt={contact.name} className="w-full h-full object-cover" />*/}
          {/*    </div>*/}
          {/*    <span className="text-sm leading-5">{contact.name}</span>*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>
      </aside>
    </div>
  );
}
