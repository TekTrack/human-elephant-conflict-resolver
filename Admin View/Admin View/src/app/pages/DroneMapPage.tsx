import { useState, useRef, useCallback, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { Navigation, Crosshair, X, Check, Battery, PowerOff } from "lucide-react";
// @ts-ignore
import Map, { Source, Layer, Marker, NavigationControl } from "react-map-gl/maplibre";
import type { MapRef, MapMouseEvent } from "react-map-gl/maplibre";

import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";

// ── Types & Constants ─────────────────────────────────────────────────────────
type DroneStatus = "Patrolling" | "Idle" | "Charging" | "Offline";

interface Drone {
  id: string;
  name: string;
  status: DroneStatus;
  battery: number;
  color: string;
  path: [number, number][]; // Array of [longitude, latitude]
}

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const MAP_STYLE_LIGHT = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

// Initial Dummy Drones
const INITIAL_DRONES: Drone[] = [
  { id: "D-01", name: "Alpha Watcher", status: "Patrolling", battery: 84, color: "#3b82f6", path: [[80.7, 7.8], [80.75, 7.85], [80.8, 7.82]] },
  { id: "D-02", name: "Bravo Scout", status: "Idle", battery: 100, color: "#10b981", path: [] },
  { id: "D-03", name: "Charlie Sweeper", status: "Charging", battery: 12, color: "#f59e0b", path: [] },
  { id: "D-04", name: "Delta Wing", status: "Offline", battery: 0, color: "#6b7280", path: [] },
  { id: "D-05", name: "Delta Wing", status: "Offline", battery: 0, color: "#6b7280", path: [] },
  { id: "D-06", name: "Delta Wing", status: "Offline", battery: 0, color: "#6b7280", path: [] },
  { id: "D-07", name: "Delta Wing", status: "Offline", battery: 0, color: "#6b7280", path: [] }
];

export function DroneMapPage() { // Note: You might want to rename this component/file to DroneRoutingPage
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mapRef = useRef<MapRef>(null);

  // ── State ───────────────────────────────────────────────────────────────────
  const [drones, setDrones] = useState<Drone[]>(INITIAL_DRONES);

  // Drawing State
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftPath, setDraftPath] = useState<[number, number][]>([]);
  const [mousePos, setMousePos] = useState<[number, number] | null>(null);

  const selectedDrone = drones.find((d) => d.id === selectedDroneId);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const startDrawing = (droneId: string) => {
    setSelectedDroneId(droneId);
    setIsDrawing(true);
    setDraftPath([]);
    setMousePos(null);
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setSelectedDroneId(null);
    setDraftPath([]);
    setMousePos(null);
  };

  const savePath = () => {
    if (!selectedDroneId || draftPath.length < 2) return;

    setDrones((prev) =>
        prev.map((d) => (d.id === selectedDroneId ? { ...d, path: draftPath, status: "Patrolling" } : d))
    );
    cancelDrawing();
  };

  const clearDronePath = (droneId: string) => {
    setDrones((prev) =>
        prev.map((d) => (d.id === droneId ? { ...d, path: [], status: "Idle" } : d))
    );
  };

  // ── Map Events ──────────────────────────────────────────────────────────────
  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (!isDrawing) return;
    const newPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    setDraftPath((prev) => [...prev, newPoint]);
  }, [isDrawing]);

  const handleMapMouseMove = useCallback((e: MapMouseEvent) => {
    if (!isDrawing) return;
    setMousePos([e.lngLat.lng, e.lngLat.lat]);
  }, [isDrawing]);

  // ── GeoJSON Generation ──────────────────────────────────────────────────────

  // 1. Saved paths for all drones
  const savedPathsGeoJSON = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: drones
          .filter((d) => d.path.length > 1 && d.id !== selectedDroneId) // Hide saved path of currently drawing drone
          .map((d) => ({
            type: "Feature" as const,
            properties: { color: d.color },
            geometry: {
              type: "LineString" as const,
              coordinates: d.path,
            },
          })),
    };
  }, [drones, selectedDroneId]);

  // 2. Draft path (includes the locked waypoints + the live line to the mouse cursor)
  const draftPathGeoJSON = useMemo(() => {
    if (!isDrawing || !selectedDrone) return null;

    // Combine clicked points with current mouse position to draw the "preview" line
    const coords = [...draftPath];
    if (mousePos && draftPath.length > 0) coords.push(mousePos);

    if (coords.length < 2) return null;

    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { color: selectedDrone.color },
          geometry: {
            type: "LineString" as const,
            coordinates: coords,
          },
        },
      ],
    };
  }, [isDrawing, draftPath, mousePos, selectedDrone]);

  // ── UI Helpers ──────────────────────────────────────────────────────────────
  const getStatusVariant = (status: DroneStatus) => {
    switch (status) {
      case "Patrolling": return "success";
      case "Idle": return "info";
      case "Charging": return "warning";
      case "Offline": return "neutral";
    }
  };

  return (
      <div className="p-8 space-y-6 flex flex-col h-full">
        <PageHeader
            title="Drone Path Control"
            description="Assign automated patrol routes and waypoints to fleet drones"
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-[600px]">

          {/* ── LEFT SIDEBAR: Drone Fleet ── */}
          <div className="space-y-4 xl:col-span-1 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="font-semibold text-lg  ">Fleet Selection</h3>

            {drones.map((drone) => (
                <Card
                    key={drone.id}
                    className={`p-4 transition-all ${
                        selectedDroneId === drone.id
                            ? "ring-2"
                            : ""
                    }`}
                    style={selectedDroneId === drone.id ? { borderColor: drone.color, backgroundColor: `${drone.color}15` } : {}}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: drone.color }} />
                      <h4 className="font-semibold ">{drone.id}</h4>
                    </div>
                    <Badge variant={getStatusVariant(drone.status)}>{drone.status}</Badge>
                  </div>

                  <p className={`text-sm mb-4 ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>
                    {drone.name}
                  </p>

                  <div className="flex items-center justify-between text-xs mb-4">
                    <div className="flex items-center gap-1.5">
                      <Battery className={`w-4 h-4 ${drone.battery < 20 ? "text-red-500" : "text-green-500"}`} />
                      <span >{drone.battery}%</span>
                    </div>
                    {drone.path.length > 0 ? (
                        <span className="text-gray-500">Route Assigned ({drone.path.length} pts)</span>
                    ) : (
                        <span className="text-gray-500">No Route</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                        variant="secondary"
                        className="flex-1 text-xs py-1.5"
                        disabled={drone.status === "Offline"}
                        onClick={() => startDrawing(drone.id)}
                    >
                      <Navigation className="w-3 h-3" />
                      {drone.path.length > 0 ? "Redraw" : "Draw Path"}
                    </Button>

                    {drone.path.length > 0 && (
                        <Button
                            variant="danger"
                            className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => clearDronePath(drone.id)}
                            title="Clear Path"
                        >
                          <PowerOff className="w-3 h-3" />
                        </Button>
                    )}
                  </div>
                </Card>
            ))}
          </div>

          {/* ── RIGHT SIDE: Map View ── */}
          <Card noPadding className="xl:col-span-3 overflow-hidden relative flex flex-col">

            {/* Drawing Overlay / Toolbar */}
            {isDrawing && selectedDrone && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-md border border-[rgba(255,255,255,0.2)] rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl">
                  <div className="flex items-center gap-2 text-white">
                    <Crosshair className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="text-sm font-medium">
                  Routing <span style={{ color: selectedDrone.color }}>{selectedDrone.name}</span>
                </span>
                    <span className="text-xs text-gray-400 ml-2">({draftPath.length} waypoints)</span>
                  </div>

                  <div className="flex items-center gap-2 border-l border-gray-600 pl-6">
                    <Button variant="ghost" className="text-xs py-1 text-white hover:bg-white/10" onClick={cancelDrawing}>
                      <X className="w-3 h-3" /> Cancel
                    </Button>
                    <Button
                        variant="primary"
                        className="text-xs py-1"
                        disabled={draftPath.length < 2}
                        onClick={savePath}
                    >
                      <Check className="w-3 h-3" /> Save Route
                    </Button>
                  </div>
                </div>
            )}

            {/* Map Container */}
            <div className="flex-1 w-full relative" style={{ minHeight: "600px" }}>
              <Map
                  ref={mapRef}
                  initialViewState={{ longitude: 80.7718, latitude: 7.8731, zoom: 8 }}
                  mapStyle={isDark ? MAP_STYLE : MAP_STYLE_LIGHT}
                  style={{ width: "100%", height: "100%" }}
                  onClick={handleMapClick}
                  onMouseMove={handleMapMouseMove}
                  cursor={isDrawing ? "crosshair" : "grab"}
                  dragPan={!isDrawing} // Lock map dragging while drawing for precision
              >
                <NavigationControl position="top-right" />

                {/* Render Saved Paths */}
                <Source id="saved-paths" type="geojson" data={savedPathsGeoJSON}>
                  <Layer
                      id="saved-paths-line"
                      type="line"
                      paint={{
                        "line-color": ["get", "color"],
                        "line-width": 4,
                        "line-opacity": 0.6,
                      }}
                      layout={{
                        "line-join": "round",
                        "line-cap": "round"
                      }}
                  />
                </Source>

                {/* Render Draft Path (Live Drawing) */}
                {draftPathGeoJSON && (
                    <Source id="draft-path" type="geojson" data={draftPathGeoJSON}>
                      <Layer
                          id="draft-path-line"
                          type="line"
                          paint={{
                            "line-color": selectedDrone?.color || "#fff",
                            "line-width": 4,
                            "line-dasharray": [2, 2], // Dashed line to indicate "pending"
                          }}
                      />
                    </Source>
                )}

                {/* Render Waypoint Markers for Draft Path */}
                {draftPath.map((pt, i) => (
                    <Marker key={`draft-${i}`} longitude={pt[0]} latitude={pt[1]} anchor="center">
                      <div className="w-3 h-3 bg-white rounded-full shadow-md" style={{ border: `2px solid ${selectedDrone?.color}` }} />
                    </Marker>
                ))}

                {/* Render Drone Position Markers (At the start of their paths) */}
                {drones.filter(d => d.path.length > 0).map((drone) => (
                    <Marker key={`drone-${drone.id}`} longitude={drone.path[0][0]} latitude={drone.path[0][1]} anchor="center">
                      <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg shadow-black/50"
                          style={{ backgroundColor: drone.color }}
                      >
                        <Navigation className="w-4 h-4 transform rotate-45" />
                      </div>
                    </Marker>
                ))}

              </Map>
            </div>
          </Card>
        </div>
      </div>
  );
}