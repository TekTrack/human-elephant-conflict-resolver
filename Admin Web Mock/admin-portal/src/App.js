
import React, { useState, useEffect } from 'react';
import './App.css'; // Optional: add your own styling here
import NotificationHandler from './NotificationHandler';
import Navbar from './Navbar'; 
import Drones from './Pages/Drones';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Dashboard states
  const [zones, setZones] = useState([]);
  const [sightingId, setSightingId] = useState('');
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [newZone, setNewZone] = useState({ name: '', minLat: '', maxLat: '', minLon: '', maxLon: '' });

  const BASE_URL = 'http://localhost:8080/api/admin';

  // 🔐 Login Flow
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setIsLoggedIn(true);
        fetchZones(); // Load zones automatically on login
      } else {
        alert('❌ Invalid credentials');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 👑 Create Admin
  const handleCreateAdmin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/newadmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      const data = await res.json();
      alert(data.message || 'Admin action completed');
    } catch (err) {
      console.error(err);
    }
  };

  // async function checkNotifications() {
  //     try {
  //         const response = await fetch('http://localhost:8080/api/admin/notifications');
  //         const data = await response.json();

  //         // Displaying the alert
  //         if (data.message) {
  //             alert(`[${data.type}] Notification: ${data.message}`);
  //         }
  //     } catch (error) {
  //         console.error('Error fetching notification:', error);
  //     }
  // };
  // checkNotifications(); // Call it once on load

  // ✅ Verify Sighting
  const handleVerify = async () => {
    try {
      const res = await fetch(`${BASE_URL}/sightings/${sightingId}/verify`, { method: 'PUT' });
      const text = await res.text();
      alert(text);
    } catch (err) {
      console.error(err);
    }
  };

  // 🗺️ Zone Logic
  const fetchZones = async () => {
    try {
      const res = await fetch(`${BASE_URL}/zones`);
      const data = await res.json();
      setZones(data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleSaveZone = async () => {
    try {
      const res = await fetch(`${BASE_URL}/zones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZone)
      });
      const data = await res.json();
      alert(`✅ Zone saved: ${data.name}`);
      fetchZones(); // Refresh the list
    } catch (err) {
      console.error(err);
    }
  };

// 🛠️ For development: auto-login (remove in production)
  useEffect(() => {
    setUsername('admin');
    setPassword('password');
    setIsLoggedIn(true);
  }, []);


  // 🖥️ UI Render
  // if (!isLoggedIn) {
  //   return (
  //     <div style={{ padding: '2rem' }}>
  //       <h2>Admin Login 🔐</h2>
  //       <form onSubmit={handleLogin}>
  //         <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
  //         <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
  //         <button type="submit">Login</button>
  //       </form>
  //     </div>
  //   );
  // }

  return (
    <div style={{ padding: '2rem' }}>

      <h1>Dashboard 🎛️</h1>
      <NotificationHandler />

      <hr />
        <Navbar />
    
      <hr/>

      <button onClick={() => setIsLoggedIn(false)}>Logout</button>

      <hr />
    </div>
  );
}
