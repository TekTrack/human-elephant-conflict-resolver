import React, { useState, useEffect } from 'react';

export default function NotificationHandler({onNewAlert}) {

const [mapTrigger, setMapTrigger] = useState(0);

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
    fetch(`{BASE_URL}/sightings/${notification[2]}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        .then(response => response.json())
        .then(data => {
          res=data;          // Handle the sighting data as needed
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
      console.error( err);
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
    <div style={popupStyle}>
      <h4>🚨 New Alert!</h4>
      <p>{notification[0]}</p>
      <p>{"Type"}: {notification[1]}</p>
      <button onClick={() => setNotification(null)}>Close</button>
      <br/>
      <button onClick={() => viewNotification(notification)}>View</button>
    </div>

  );

  
}