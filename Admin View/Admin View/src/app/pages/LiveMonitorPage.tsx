import { useEffect, useState } from "react";
import { Video, Activity, Radio, Eye, X, Loader2, AlertCircle, RefreshCw, CheckCircle2, Plus, Drone } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { useParams } from "react-router";

import { useTheme } from "../context/ThemeContext";
import { useMapTrigger } from "../context/MapTriggerContext";

interface Drone {
  id: number; // Fallback structure for IDs
  coordinates: string;
  active: boolean;
  remoteControlled: boolean;
}

export function LiveMonitorPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { BASE_URL } = useMapTrigger();
  const { droneId } = useParams<{droneId: string}>();
  
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [droneImageSrc, setDroneImageSrc] = useState<string | null>(null);
  const [fetchingVideo, setFetchingVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDrone, setNewDrone] = useState<Partial<any>>({ id: 0, coordinates: "", active: true, remoteControlled: true });

  const fetchDrones = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/drones`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDrones(data.data || data || []);
      } else {
        setError("Failed to fetch drones data from server");
      }
    } catch (err) {
      console.error(err);
      setError("Network Error: Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const createDrone = async (newDroneData: Partial<any>) => {
  try {

    const payload = {
      id: Number(newDroneData.id), 
      coordinates: String(newDroneData.coordinates), 
      active: Boolean(newDroneData.active), 
      remoteControlled: Boolean(newDroneData.remoteControlled) 
    };
    console.log("Sending payload:", payload); 
    const res = await fetch(`${BASE_URL}/drones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setShowCreateModal(false);
      fetchDrones();
      setNewDrone({ id: 0, coordinates: "", active: true, remoteControlled: true });
    } else {
      alert("Failed to create drone. 400 Bad Request.");
    }
  } catch (err) {
    console.error(err);
  }
}

  // const handleSaveDrone = async () => {
  //   if (newDrone.id !== undefined && newDrone.id !== null) {
  //     await createDrone(newDrone as Drone);
  //     setShowCreateModal(false);
  //     fetchDrones();
  //   }
  // };

  useEffect(() => {
    fetchDrones();
  }, [BASE_URL]);

  const fetchDroneFeed = async (droneid: string | number): Promise<string | null> => {
    try {
      setVideoError(false);
      
      // 👇 TRICK THE BROWSER: Add '?t=timestamp' so it never caches the image!
      const cacheBuster = new Date().getTime();
      const res = await fetch(`${BASE_URL}/liveDroneFeed/${droneid}?t=${cacheBuster}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });

      if (res.ok) {
        const imageBlob = await res.blob(); 
        const imageUrl = URL.createObjectURL(imageBlob); 
        return imageUrl; 
      }
      setVideoError(true);
      return null;
    } catch (error) {
      console.error("Error fetching drone feed:", error);
      setVideoError(true);
      return null;
    }
  };

  useEffect(() => {
    if (droneId && drones.length > 0) {
      const foundDrone = drones.find(d => d.id === Number(droneId));     
      if (foundDrone) {
        handleViewDrone(foundDrone);
      }
    }
  }, [droneId, drones]);

  useEffect(() => {
    if (!selectedDrone) return;
    const intervalId = setInterval(async () => {
      const newUrl = await fetchDroneFeed(selectedDrone.id);
      
      if (newUrl) {
        setDroneImageSrc((oldUrl) => {
          if (oldUrl) {
            URL.revokeObjectURL(oldUrl);
          }
          return newUrl; 
        });
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [selectedDrone]); 

  const activeDronesCount = drones.filter(d => d.active).length;
  const maintenanceCount = drones.filter(d => !d.active).length;

  const handleViewDrone = (drone: Drone) => {
    setSelectedDrone(drone);
    setDroneImageSrc(null);
    setFetchingVideo(true);
    const id = drone.id ?? 1; // Fallback
    fetchDroneFeed(id).then((url) => {
      if (url) {
        setDroneImageSrc(url);
      }
      setFetchingVideo(false);
    });
  };

  const closeVideo = () => {
    setSelectedDrone(null);
    if (droneImageSrc) {
      URL.revokeObjectURL(droneImageSrc);
    }
    setDroneImageSrc(null);
  };

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Live Monitor"
        description="Real-time surveillance camera feeds"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20">
              <Radio className="w-4 h-4 text-green-500 animate-pulse" />
              <span className="text-sm text-green-500 font-medium">Live System</span>
            </div>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              Create Drone
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          label="Total Drones"
          value={drones.length}
          icon={<Video className="w-5 h-5 text-blue-600" />}
          iconBgClass="bg-blue-100"
        />
        <StatCard
          label="Active"
          value={activeDronesCount}
          icon={<Activity className="w-5 h-5 text-green-600" />}
          iconBgClass="bg-green-100"
          valueColorClass="text-green-500"
        />
        <StatCard
          label="Maintenance"
          value={maintenanceCount}
          icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
          iconBgClass="bg-yellow-100"
          valueColorClass="text-yellow-500"
        />
      </div>

      <Card noPadding>
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-24 gap-3">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="text-sm font-medium opacity-60">Loading drones...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center flex flex-col items-center gap-4 text-red-500">
              <AlertCircle className="w-16 h-16 opacity-30" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Connection Failed</h3>
                <p className="text-sm opacity-80 max-w-xs">{error}</p>
              </div>
              <button 
                onClick={fetchDrones} 
                className={`mt-2 flex items-center px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${isDark ? 'border-white/20 text-white' : 'border-gray-300 text-black'}`}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> 
                Try Again
              </button>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className={isDark ? "bg-white/5 text-white/40" : "bg-gray-50 text-gray-500"}>
                <tr>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Drone Name</th>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest">Location</th>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/10" : "divide-gray-100"}`}>
                {drones.length > 0 ? (
                  drones.map((drone) => (
                    <tr key={drone.id} className="hover:bg-blue-500/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm bg-blue-600">
                              <Video className="w-5 h-5" />
                            </div>
                            {drone.active? (
                               <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full"></div>
                            ) : (
                               <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-yellow-500 border-2 border-white dark:border-[#121212] rounded-full"></div>
                            )}
                          </div>
                          <span className="font-semibold text-[15px] dark:text-white">{`Drone ${drone.id}`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="opacity-80 dark:text-white/80">{drone.coordinates || "Unknown"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          {drone.active ? (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              LIVE
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold uppercase">
                              MAINTENANCE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleViewDrone(drone)}
                          className={`p-2 rounded-lg transition-colors inline-block ${isDark ? "hover:bg-white/10 dark:text-white" : "hover:bg-gray-100 text-black"}`}
                          title="View Live Feed"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-32 text-center">
                       <div className="flex flex-col items-center opacity-30 gap-3 dark:text-white">
                          <Video className="w-12 h-12" />
                          <div className="italic text-sm">
                            No drones available.
                          </div>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Drone Video Modal */}
      {selectedDrone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
                <Radio className="w-5 h-5 text-red-500 animate-pulse" /> 
                Live Feed: {`Drone ${selectedDrone.id?? selectedDrone.id}`}
              </h3>
              <button 
                onClick={closeVideo}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-black'}`}
                title="Close Window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="w-full aspect-video bg-black flex items-center justify-center relative">
              {fetchingVideo ? (
                <div className="flex flex-col items-center gap-4 text-white">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                  <p>Connecting to drone feed...</p>
                </div>
              ) : videoError || !droneImageSrc ? (
                 <div className="flex flex-col items-center gap-4 text-red-500">
                  <AlertCircle className="w-12 h-12 opacity-50" />
                  <p>Feed unavailable or connection lost.</p>
                </div>
              ) : (
                <img src={droneImageSrc} alt={`Feed from ${selectedDrone.id}`} className="w-full h-full object-contain" />
              )}
            </div>
            
            <div className={`px-6 py-4 border-t flex justify-between items-center ${isDark ? 'border-white/10 text-white/60' : 'border-gray-200 text-gray-600'} text-sm`}>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Secure Connection</span>
              <span>ID: {selectedDrone.id}</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Drone Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />

          <Card className="relative w-full max-w-md p-6 shadow-2xl z-10" noPadding={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-black dark:text-white">Create New Drone</h2>
              <Button variant="ghost" className="p-1.5" onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                type="number"
                label="Drone ID *"
                placeholder="e.g. 1"
                value={newDrone.id || ""}
                onChange={(e) => setNewDrone({ ...newDrone, id: parseInt(e.target.value) })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Latitude *"
                  placeholder="e.g. 6.927"
                  // Split the string to show just the latitude
                  value={newDrone.coordinates?.split(',')[0] || ""}
                  onChange={(e) => {
                    const lon = newDrone.coordinates?.split(',')[1] || "0";
                    setNewDrone({ ...newDrone, coordinates: `${e.target.value},${lon}` });
                  }}
                />
                <Input
                  type="number"
                  label="Longitude *"
                  placeholder="e.g. 79.861"
                  // Split the string to show just the longitude
                  value={newDrone.coordinates?.split(',')[1] || ""}
                  onChange={(e) => {
                    const lat = newDrone.coordinates?.split(',')[0] || "0";
                    setNewDrone({ ...newDrone, coordinates: `${lat},${e.target.value}` });
                  }}
                />
              </div>

              <Select
                label="Active Status"
                value={newDrone.active ? "true" : "false"}
                // Parse the string back into a real boolean for Java!
                onChange={(e) => setNewDrone({ ...newDrone, active: e.target.value === "true" })}
              >
                <option value="true">Active</option>
                <option value="false">Maintenance / Inactive</option>
              </Select>

              <Select
                label="Remote Controlled"
                value={newDrone.remoteControlled ? "true" : "false"}
                onChange={(e) => setNewDrone({ ...newDrone, remoteControlled: e.target.value === "true" })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={()=>createDrone(newDrone)}>Create Drone</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}