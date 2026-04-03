import React, { useState,useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, Popup, FeatureGroup,Marker } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw'; // 👈 Import the drawing tools
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'; // 👈 Import the drawing CSS!
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function Zones({ BASE_URL}) {
  // State for the new zone we are creating
  const [newZone, setNewZone] = useState({ name: '', id: '', minLat: '', maxLat: '', minLon: '', maxLon: '' });
  const [zones, setZones] = useState([]); // State to hold existing zones from the database
  const [filter, setFilter] = useState('hour');
  const [sightings, setSightings] = useState([]);
  const mapCenter = [7.8731, 80.7718]; // Sri Lanka 🇱🇰

    // Helper function to pick the color
  const getZoneColor = (lastSightingDate) => {
    if (!lastSightingDate) return 'green'; // Never breached
  
    const hoursSince = (new Date() - new Date(lastSightingDate)) / (1000 * 60 * 60);
    return hoursSince < 24 ? 'red' : 'yellow'; 
  };

  const fetchSightings = async (timeframe) => {
    const res = await fetch(`${BASE_URL}/sightings/filter?timeframe=${timeframe}`);
    const data = await res.json();
    setSightings(data);
  };


  const fetchZones = async () => {
      try {
        const res = await fetch(`${BASE_URL}/zones`);
        const data = await res.json();
        setZones(data);
      } catch (err) {
        console.error(err);
      }
    };
  
    useEffect(() => {
        fetchZones(); // Load zones when the component mounts
        fetchSightings(filter);
    }, []);


  // 💾 Save function (same as before)
  const handleSaveZone = async () => {
    try {
      const res = await fetch(`${BASE_URL}/zones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZone)
      });
      const data = await res.json();
      alert(`✅ Zone saved: ${data.name}`);
      fetchZones(); // Refresh the active zones
    } catch (err) {
      console.error(err);
    }
  };

  // 🖍️ This runs the exact second you finish drawing a shape!
  const handleMapCreate = (e) => {
    if (e.layerType === 'rectangle') {
      const bounds = e.layer.getBounds();
      
      // Automatically grab the coordinates from the drawn box and update our state!
      setNewZone({
        ...newZone,
        minLat: bounds.getSouthWest().lat,
        maxLat: bounds.getNorthEast().lat,
        minLon: bounds.getSouthWest().lng,
        maxLon: bounds.getNorthEast().lng,
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      
      {/* --- CREATION FORM --- */}
      <h3>3. Create Zone (Draw on map below!) 🗺️</h3>
      <input 
        placeholder="Zone Name (e.g. Yala Border)" 
        value={newZone.name}
        onChange={e => setNewZone({...newZone, name: e.target.value})} 
      />
      <input 
        placeholder="Zone ID" 
        value={newZone.id}
        onChange={e => setNewZone({...newZone, id: e.target.value})} 
      />
      {/* We make these read-only so you can see the auto-filled coordinates */}
      <input placeholder="Min Lat" value={newZone.minLat} readOnly />
      <input placeholder="Max Lat" value={newZone.maxLat} readOnly />
      <input placeholder="Min Lon" value={newZone.minLon} readOnly />
      <input placeholder="Max Lon" value={newZone.maxLon} readOnly />
      <button onClick={handleSaveZone}>Save Zone</button>

      <hr />

      

      {/* --- INTERACTIVE MAP --- */}
      <h3>4. Active & Drawing Map 📍</h3>

      <select onChange={(e) => { setFilter(e.target.value); fetchSightings(e.target.value); }}>
         <option value="all">All Time</option>
         <option value="hour">Last Hour</option>
         <option value="day">Last 24 Hours</option>
         <option value="week">Last Week</option>
      </select>
        
      <button onClick={fetchZones}>Refresh Map</button>
      
      <MapContainer 
        center={mapCenter} 
        zoom={7} 
        style={{ height: '500px', width: '100%', marginTop: '10px', borderRadius: '8px' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🛠️ The Drawing Tools! */}
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleMapCreate}
            draw={{
              rectangle: true,   // Only allow drawing rectangles
              polyline: false,
              polygon: false,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>

        {sightings.map((sighting, idx) => (
        <Marker key={idx} position={[sighting.latitude, sighting.longitude]}>
            <Popup>🐘 Sighting at {new Date(sighting.timestamp).toLocaleString()}</Popup>
        </Marker>
        ))}

        {/* Draw the existing danger zones from the database */}
        {zones?.map((z, index) => {
          const bounds = [[z.minLat, z.minLon], [z.maxLat, z.maxLon]];
          return (
            // Inside your map loop:
            <Rectangle 
            key={index} 
            bounds={bounds} 
            pathOptions={{ color: getZoneColor(z.lastSightingDate), weight: 2, fillOpacity: 0.3 }}
            >
              <Popup>
                <strong>{z.name}</strong><br/>
                🚨 Last Sighting: {z.lastSightingDate ? new Date(z.lastSightingDate).toLocaleString() : 'Safe'}
              </Popup>

            </Rectangle>
          );
        })}
      </MapContainer>
    </div>
  );
}