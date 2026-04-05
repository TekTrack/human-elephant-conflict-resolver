


//     // Helper function to pick the color
//   const getZoneColor = (lastSightingDate) => {
//     if (!lastSightingDate) return 'green'; // Never breached
  
//     const hoursSince = (new Date() - new Date(lastSightingDate)) / (1000 * 60 * 60);
//     return hoursSince < 24 ? 'red' : 'yellow'; 
//   };

//   const fetchSightings = async (timeframe) => {
//     const token = localStorage.getItem('authToken'); // Grab the saved token
//     const res = await fetch(`${BASE_URL}/sightings/filter?timeframe=${timeframe}`,{
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });
//     const data = await res.json();
//     setSightings(data);
//   };

  
    // useEffect(() => {
    //     fetchZones(); // Load zones when the component mounts
    //     fetchSightings(filter);
    // }, [filter,mapTrigger]);




  // 🖍️ This runs the exact second you finish drawing a shape!
//   const handleMapCreate = (e) => {
//     if (e.layerType === 'rectangle') {
//       const bounds = e.layer.getBounds();
      
//       // Automatically grab the coordinates from the drawn box and update our state!
//       setNewZone({
//         ...newZone,
//         minLat: bounds.getSouthWest().lat,
//         maxLat: bounds.getNorthEast().lat,
//         minLon: bounds.getSouthWest().lng,
//         maxLon: bounds.getNorthEast().lng,
//       });
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
      
//       {/* --- CREATION FORM --- */}
//       <h3>3. Create Zone (Draw on map below!) 🗺️</h3>
//       <input 
//         placeholder="Zone Name (e.g. Yala Border)" 
//         value={newZone.name}
//         onChange={e => setNewZone({...newZone, name: e.target.value})} 
//       />
//       <input 
//         placeholder="Zone ID" 
//         value={newZone.id}
//         onChange={e => setNewZone({...newZone, id: e.target.value})} 
//       />
//       {/* We make these read-only so you can see the auto-filled coordinates */}
//       <input placeholder="Min Lat" value={newZone.minLat} readOnly />
//       <input placeholder="Max Lat" value={newZone.maxLat} readOnly />
//       <input placeholder="Min Lon" value={newZone.minLon} readOnly />
//       <input placeholder="Max Lon" value={newZone.maxLon} readOnly />
//       <button onClick={handleSaveZone}>Save Zone</button>

//       <hr />

      

//       {/* --- INTERACTIVE MAP --- */}
//       <h3>4. Active & Drawing Map 📍</h3>

//       <select onChange={(e) => { setFilter(e.target.value); fetchSightings(e.target.value); }}>
//          <option value="all">All Time</option>
//          <option value="hour">Last Hour</option>
//          <option value="day">Last 24 Hours</option>
//          <option value="week">Last Week</option>
//       </select>
        
//       <button onClick={fetchZones}>Refresh Map</button>
      
//       <MapContainer 
//         center={mapCenter} 
//         zoom={7} 
//         style={{ height: '500px', width: '100%', marginTop: '10px', borderRadius: '8px' }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* 🛠️ The Drawing Tools! */}
//         <FeatureGroup>
//           <EditControl
//             position="topright"
//             onCreated={handleMapCreate}
//             draw={{
//               rectangle: true,   // Only allow drawing rectangles
//               polyline: false,
//               polygon: false,
//               circle: false,
//               marker: false,
//               circlemarker: false,
//             }}
//           />
//         </FeatureGroup>

//         {sightings.map((sighting, idx) => (
//         <Marker key={idx} position={[sighting.latitude, sighting.longitude]}>
//             <Popup>🐘 Sighting at {new Date(sighting.timestamp).toLocaleString()}</Popup>
//         </Marker>
//         ))}

//         {/* Draw the existing danger zones from the database */}
//         {zones?.map((z, index) => {
//           const bounds = [[z.minLat, z.minLon], [z.maxLat, z.maxLon]];
//           return (
//             // Inside your map loop:
//             <Rectangle 
//             key={index} 
//             bounds={bounds} 
//             pathOptions={{ color: getZoneColor(z.lastSightingDate), weight: 2, fillOpacity: 0.3 }}
//             >
//               <Popup>
//                 <strong>{z.name}</strong><br/>
//                 🚨 Last Sighting: {z.lastSightingDate ? new Date(z.lastSightingDate).toLocaleString() : 'Safe'}
//               </Popup>

//             </Rectangle>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
 
export default function Zones(){} 