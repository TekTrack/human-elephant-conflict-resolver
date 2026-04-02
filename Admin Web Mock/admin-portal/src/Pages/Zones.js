import React from 'react';
import { MapContainer, TileLayer, Rectangle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Don't forget this!

export default function Zones({ BASE_URL, zones, fetchZones }) {
  // Rough center of Sri Lanka 🇱🇰
  const mapCenter = [7.8731, 80.7718]; 

  return (
    <div style={{ padding: '20px' }}>
      <h3>Active Danger Zones 🗺️</h3>
      <button onClick={fetchZones}>Refresh Map</button>

      {/* The Interactive Map */}
      <MapContainer 
        center={mapCenter} 
        zoom={7} 
        style={{ height: '500px', width: '100%', marginTop: '10px', borderRadius: '8px' }}
      >
        {/* OpenStreetMap Base Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        {/* Loop through your zones and draw Rectangles 🟥 */}
        {zones?.map((z, index) => {
          // Leaflet needs [[minLat, minLon], [maxLat, maxLon]]
          const bounds = [
            [z.minLat, z.minLon], 
            [z.maxLat, z.maxLon]
          ];

          return (
            <Rectangle key={index} bounds={bounds} pathOptions={{ color: 'red', weight: 2 }}>
              {/* This pops up when you click the red box! 🖱️ */}
              <Popup>
                <strong>{z.name}</strong> <br/>
                🚨 Active Danger Zone
              </Popup>
            </Rectangle>
          );
        })}
      </MapContainer>
    </div>
  );
}