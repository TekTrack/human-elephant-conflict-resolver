import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { AlertCircle, X, Search } from 'lucide-react';

export default function NotificationHandler({onNewAlert}) {
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const panelBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "border-[rgba(255,255,255,0.15)]" : "border-gray-200";
  const textSecondary = isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500";
  const primaryButtonBg = isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800";
  const secondaryButtonBg = isDark ? "bg-[#333] text-white hover:bg-[#444]" : "bg-gray-100 text-black hover:bg-gray-200";
  const overlayBg = isDark ? "bg-black/60" : "bg-black/30";

  const [notification, setNotification] = useState(null);
  const BASE_URL = 'http://localhost:8080/api/admin';

  // JavaScript running on the Admin Web Portal
  function verifySighting(sightingId) {
      fetch(`http://localhost:8080/api/admin/sightings/${sightingId}/verify`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
      })
      .then(response => response.text())
      .then(data => {
          alert("Success: " + data); // Shows "Sighting 1 verified!"
      })
      .catch(error => console.error('Error:', error));
  };

  const viewNotification = async (notification) => {
    fetch(`${BASE_URL}/sightings/${notification[2]}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        .then(response => response.json())
        .then(data => {
          let res=data;          // Handle the sighting data as needed
          console.log('Sighting details:', res);
          // For example, you could open a modal with the sighting details
        })
    
    try {
      if(notification[1] === "DroneAlert") {
        window.open('/drones', '_blank');
        
      } else if(notification[1] === "SightingAlert") {
        window.open('/sightings', '_blank');
      }
    }catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await fetch(`${BASE_URL}/notifications`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        if (res.ok) {
          const data = await res.json();
          // 🛠️ THE FIX: This forces the single JSON object into an array!
          if(data.message) {
            setNotification([data.message,data.type]);
            onNewAlert(); // Notify parent component of new alert
          }else{
            return null; // No new notifications, don't update statet
          }
        }
      } catch (nullErr) {
      }
    };

    fetchNotification();
    const intervalId = setInterval(fetchNotification, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (!notification) return null; // Don't render anything if there's no notification

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-[1000] pointer-events-auto ${overlayBg} backdrop-blur-sm transition-opacity duration-300`}>
      <div className={`relative w-full max-w-sm p-7 rounded-2xl shadow-2xl border ${borderColor} ${panelBg} ${textColor} text-center flex flex-col items-center animate-in fade-in zoom-in duration-300`}>
        
        {/* Decorative Alert Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-4 border-4 border-white dark:border-[#1a1a1a] shadow-sm">
          <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>

        <h4 className="text-xl font-bold mb-2">New Alert Triggered</h4>
        
        <div className="inline-block px-3 py-1 mt-1 mb-3 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
          {notification[1]}
        </div>

        <p className={`text-sm mb-6 px-2 ${textSecondary}`}>
          {notification[0]}
        </p>
        
        <div className="flex gap-3 w-full pt-2">
          <button 
            onClick={() => setNotification(null)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${secondaryButtonBg}`}
          >
            <X className="w-4 h-4" /> Dismiss
          </button>
          
          <button 
            onClick={() => {
              viewNotification(notification);
              setNotification(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors shadow-sm ${primaryButtonBg}`}
          >
           <Search className="w-4 h-4" /> View
          </button>
        </div>
      </div>
    </div>
  );
}