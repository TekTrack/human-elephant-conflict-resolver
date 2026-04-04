import { RouterProvider } from 'react-router';
import React, { useState } from 'react';
import { router } from './routes';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
// @ts-ignore - Keeps TS from complaining about the JS file
import Auth from './utilities/Auth.js';
import { Sun, Moon } from "lucide-react";

const { login } = Auth;

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
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg hover:opacity-60 transition-opacity`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mt-2 mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-sm ${isDark ? "bg-white" : "bg-black"}`}>
            <span className={`text-2xl font-bold ${isDark ? "text-black" : "text-white"}`}>A</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Area</h2>
          <p className={`text-sm mt-2 ${textSecondary}`}>Enter your credentials to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>Username</label>
            <input 
              className={`w-full p-3 rounded-xl border ${borderColor} ${inputBg} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
              placeholder="Username" 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>Password</label>
            <input 
              className={`w-full p-3 rounded-xl border ${borderColor} ${inputBg} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
              type="password" 
              placeholder="Password" 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="pt-2">
            <button type="submit" className={`w-full py-3.5 px-4 rounded-xl font-medium shadow-sm transition-colors ${buttonBg}`}>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Dashboard states - specify string type for ID
  const [sightingId, setSightingId] = useState<string>('');
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });

  const BASE_URL = 'http://localhost:8080/api/admin';

  // 🔐 Login Flow
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setIsLoggedIn(true);
        login(username, password); // Store credentials in Auth utility
      } else {
        alert('❌ Invalid credentials');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🖥️ UI Render
  if (!isLoggedIn) {
    return <LoginUI handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />;
  }

  return (
     <RouterProvider router={router} />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}