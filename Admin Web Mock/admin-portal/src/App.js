
import React, { useState, useEffect } from 'react';
import './App.css'; // Optional: add your own styling here

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

  // 🖥️ UI Render
  if (!isLoggedIn) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Admin Login 🔐</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard 🎛️</h1>
      <button onClick={() => setIsLoggedIn(false)}>Logout</button>

      <hr />
      
      <h3>1. Create New Admin 👤</h3>
      <input placeholder="New Username" onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} />
      <input type="password" placeholder="New Password" onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
      <button onClick={handleCreateAdmin}>Create</button>

      <hr />

      <h3>2. Verify Sighting ✅</h3>
      <input placeholder="Sighting ID (e.g., 1)" onChange={e => setSightingId(e.target.value)} />
      <button onClick={handleVerify}>Verify</button>

      <hr />

      <h3>3. Create Zone 🗺️</h3>
      <input placeholder="Zone Name" onChange={e => setNewZone({...newZone, name: e.target.value})} />
      <input placeholder="Min Lat" onChange={e => setNewZone({...newZone, minLat: parseFloat(e.target.value)})} />
      <input placeholder="Max Lat" onChange={e => setNewZone({...newZone, maxLat: parseFloat(e.target.value)})} />
      <input placeholder="Min Lon" onChange={e => setNewZone({...newZone, minLon: parseFloat(e.target.value)})} />
      <input placeholder="Max Lon" onChange={e => setNewZone({...newZone, maxLon: parseFloat(e.target.value)})} />
      <button onClick={handleSaveZone}>Save Zone</button>

      <hr />

      <h3>4. Active Zones 📍</h3>
      <button onClick={fetchZones}>Refresh Zones</button>
      <ul>
        {zones.map((z, index) => (
          <li key={index}>{z.name} - Lat: {z.minLat} to {z.maxLat} | Lon: {z.minLon} to {z.maxLon}</li>
        ))}
      </ul>
    </div>
  );
}
