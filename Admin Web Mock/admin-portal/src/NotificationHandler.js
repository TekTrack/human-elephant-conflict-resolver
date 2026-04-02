import React, { useState, useEffect } from 'react';

export default function NotificationHandler() {
  const popupStyle = {
    position: 'fixed',
    top: '20px',
    //right: '20px',
    backgroundColor: '#ff4d4d',
    color: 'white',
    padding: '15px 25px',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
    zIndex: 1000,
  };


  const [notification, setNotification] = useState(null);
  const BASE_URL = 'http://localhost:8080/api/admin';

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await fetch(`${BASE_URL}/notifications`);
        if (res.ok) {
          const data = await res.json();
          // 🛠️ THE FIX: This forces the single JSON object into an array!
          if(data.message) {
            setNotification([data.message,data.type]);
          }
        }
      } catch (nullErr) {
      }
    };

    fetchNotification();
    const intervalId = setInterval(fetchNotification, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (!notification) return null;

  return (
    <div style={popupStyle}>
      <h4>🚨 New Alert!</h4>
      <p>{notification[0]}</p>
      <p>{"Type"}: {notification[1]}</p>
      <button onClick={() => setNotification(null)}>Close</button>
      <br/>
      <button onClick={() => console.log(notification)}>View</button>
    </div>
  );

  
}