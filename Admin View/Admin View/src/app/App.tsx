import { RouterProvider } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';
import { router } from './routes';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { MapTriggerProvider } from './context/MapTriggerContext.tsx';
import Auth from './utilities/Auth.js';
import NotificationHandler from './utilities/NotificationHandler.tsx';
import { Sun, Moon, Loader2 } from "lucide-react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import API_BASE_URL from './config/url';

const { login } = Auth;

// --- Login UI Component ---
function LoginUI({ 
  handleLogin, 
  setUsername, 
  setPassword 
}: { 
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>, 
  setUsername: (val: string) => void, 
  setPassword: (val: string) => void 
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#333]" : "bg-[#f9fafb]";
  const textColor = isDark ? "text-white" : "text-black";
  const panelBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const borderColor = isDark ? "border-[rgba(255,255,255,0.15)]" : "border-gray-200";
  const inputBg = isDark ? "bg-[#333]" : "bg-gray-50";
  const buttonBg = isDark ? "bg-white text-black hover:bg-gray-200" : "bg-[#1a1a1a] text-white hover:bg-gray-800";
  const textSecondary = isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500";

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      <div className={`w-full max-w-md p-8 space-y-6 rounded-2xl border ${borderColor} ${panelBg} shadow-2xl relative`}>
        <div className="absolute top-4 right-4">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:opacity-60 transition-opacity">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-center mt-2 mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-sm ${isDark ? "bg-white" : "bg-black"}`}>
            <span className={`text-2xl font-bold ${isDark ? "text-black" : "text-white"}`}>A</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Area</h2>
          <p className={`text-sm mt-2 ${textSecondary}`}>Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>Username</label>
            <input className={`w-full p-3 rounded-xl border ${borderColor} ${inputBg} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`} placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>Password</label>
            <input className={`w-full p-3 rounded-xl border ${borderColor} ${inputBg} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="pt-2">
            <button type="submit" className={`w-full py-3.5 px-4 rounded-xl font-medium shadow-sm transition-colors ${buttonBg}`}>Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main App Component ---
function MainApp() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#333]" : "bg-[#f9fafb]";
  const textColor = isDark ? "text-white" : "text-black";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const stompClientRef = useRef<Stomp.Client | null>(null);

  // 1. Session Verification (On App Load)
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }
      try {
        const BASE_URL = `${API_BASE_URL}/api/admin`;
        const res = await fetch(`${BASE_URL}/sightings/filter?timeframe=all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setIsLoggedIn(true);
        else localStorage.removeItem('authToken');
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    verifyToken();
  }, []);

  // 2. WebSocket Logic (Runs when isLoggedIn changes)
  useEffect(() => {
    let stompClient: Stomp.Client | null = null;

    if (isLoggedIn) {
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('username');
      
      // SockJS and Stomp connection
      const socket = new SockJS(`${API_BASE_URL}/ws-status`);
      stompClient = Stomp.over(socket);

      // stompClient.debug = () => {}; // Uncomment to hide console logs


      console.log("Connecting to WebSocket with token:", token);
      console.log("Connecting to WebSocket with username:", username);


      stompClient.connect(
        { Authorization: `Bearer ${token}`,
          username:username
         },
        () => {
          console.log('✅ WebSocket Connected: Admin Status Active');
          stompClientRef.current = stompClient;
        },
        (error) => {
          console.error('❌ WebSocket Error:', error);
        }
      );
    }

    // Cleanup: Disconnect when logging out or closing app
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("🛑 WebSocket Disconnected");
        });
      }
    };
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await login(username, password);
    if(success) {
      setIsLoggedIn(true);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${bgColor} ${textColor}`}>
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return !isLoggedIn ? (
    <LoginUI handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />
  ) : (
    <RouterProvider router={router} />
  );
}

// --- Export App ---
export default function App() {
  const [mapTrigger, setMapTrigger] = useState(0);
  const handleNewAlert = () => setMapTrigger(prev => prev + 1);
  const BASE_URL = `${API_BASE_URL}/api/admin`;

  return (
    <MapTriggerProvider mapTrigger={mapTrigger} setMapTrigger={setMapTrigger} BASE_URL={BASE_URL}>
      <ThemeProvider>
        <NotificationHandler onNewAlert={handleNewAlert} />
        <MainApp />
      </ThemeProvider>
    </MapTriggerProvider>
  );
}