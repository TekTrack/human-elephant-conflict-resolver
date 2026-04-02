import React, { useState, useEffect } from 'react';
import '../App.css'; // Optional: add your own styling here
import NotificationHandler from '../NotificationHandler';
import Navbar from '../Navbar'; 
import Drones from './Drones';


export default function Zones({BASE_URL,zones,fetchZones,setZones,handleSaveZone}) {
    const [newZone, setNewZone] = useState({ name: '', minLat: '', maxLat: '', minLon: '', maxLon: '' });
    

    return (
        
        <div>
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
                {zones?.map((z, index) => (
                <li key={index}>{z.name} - Lat: {z.minLat} to {z.maxLat} | Lon: {z.minLon} to {z.maxLon}</li>
                ))}
            </ul>       
        </div>
    );
}