import React, { useState, useEffect } from 'react';

export default function NotificationHandler() {
  const [notifications, setNotifications] = useState([]);
  const BASE_URL = 'http://localhost:8080/api/admin';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BASE_URL}/notifications`);
        if (res.ok) {
          const data = await res.json();
          // 🛠️ THE FIX: This forces the single JSON object into an array!
          setNotifications(Array.isArray(data) ? data : [data]);
        }
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ padding: '1rem', border: '2px solid red', borderRadius: '8px' }}>
      <h3 style={{ margin: 0 }}>🚨 Live Drone Alerts</h3>
      <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
        {notifications.map((n, index) => (
          <li key={index}>
            <strong>[{n.type}]</strong> {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}