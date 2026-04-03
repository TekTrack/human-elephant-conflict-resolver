import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { MapPin, Plus, Edit, Trash2, Shield, X, RefreshCw } from "lucide-react";
// @ts-ignore
import Map, {
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
} from "react-map-gl/maplibre";
import type { MapRef, MapLayerMouseEvent, MapMouseEvent } from "react-map-gl/maplibre";
// ── Types ─────────────────────────────────────────────────────────────────────

type GeofenceType = "Restricted" | "Monitored" | "High Security";
type GeofenceStatus = "Active" | "Inactive";
type FilterValue = "all" | "hour" | "day" | "week";

interface Geofence {
  id: number;
  name: string;
  type: GeofenceType;
  radius: string;
  alerts: number;
  status: GeofenceStatus;
  coordinates: string;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

interface Sighting {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface NewZoneForm {
  name: string;
  type: GeofenceType;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

interface PopupInfo {
  longitude: number;
  latitude: number;
  geofence: Geofence;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MAP_STYLE =
    "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const MAP_STYLE_LIGHT =
    "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const defaultForm: NewZoneForm = {
  name: "",
  type: "Monitored",
  minLat: 0,
  maxLat: 0,
  minLon: 0,
  maxLon: 0,
};

// Dummy sightings for demonstration
const DUMMY_SIGHTINGS: Sighting[] = [
  { latitude: 40.714, longitude: -74.006, timestamp: new Date().toISOString() },
  {
    latitude: 40.712,
    longitude: -74.008,
    timestamp: new Date(Date.now() - 3_600_000).toISOString(),
  },
  {
    latitude: 40.716,
    longitude: -74.003,
    timestamp: new Date(Date.now() - 86_400_000).toISOString(),
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getZoneColor(type: GeofenceType): string {
  if (type === "High Security") return "#ef4444";
  if (type === "Restricted") return "#f97316";
  return "#3b82f6";
}

function zonesToGeoJSON(zones: Geofence[]) {
  return {
    type: "FeatureCollection" as const,
    features: zones.map((z) => ({
      type: "Feature" as const,
      id: z.id,
      properties: {
        id: z.id,
        name: z.name,
        type: z.type,
        color: getZoneColor(z.type),
        fillColor: getZoneColor(z.type),
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [z.minLon, z.minLat],
            [z.maxLon, z.minLat],
            [z.maxLon, z.maxLat],
            [z.minLon, z.maxLat],
            [z.minLon, z.minLat],
          ],
        ],
      },
    })),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GeofencingPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mapRef = useRef<MapRef>(null);

  const [geofences, setGeofences] = useState<Geofence[]>([

  ]);

  const [showModal, setShowModal] = useState(false);
  const [newZone, setNewZone] = useState<NewZoneForm>(defaultForm);
  const [errors, setErrors] = useState<
      Partial<Record<keyof NewZoneForm, string>>
  >({});

  // Map state
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sightings, setSightings] = useState<Sighting[]>(DUMMY_SIGHTINGS);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  // Rectangle drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ lng: number; lat: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ lng: number; lat: number } | null>(null);
  const [drawMode, setDrawMode] = useState(false); // toggle draw mode on/off

  // ── Sightings filter ────────────────────────────────────────────────────────

  const fetchSightings = useCallback((f: FilterValue) => {
    const now = Date.now();
    const cutoffs: Record<FilterValue, number> = {
      all: 0,
      hour: now - 3_600_000,
      day: now - 86_400_000,
      week: now - 604_800_000,
    };
    setSightings(
        DUMMY_SIGHTINGS.filter(
            (s) => new Date(s.timestamp).getTime() >= cutoffs[f]
        )
    );
  }, []);

  const fetchZones = () => {
    // In a real app: re-fetch zones from API
    // Here we just trigger a re-render to illustrate
    setGeofences((prev) => [...prev]);
  };

  useEffect(() => {
    fetchSightings(filter);
  }, [filter, fetchSightings]);

  // ── Drawing handlers ────────────────────────────────────────────────────────

  const handleMapMouseDown = useCallback(
      (e: MapMouseEvent) => {
        if (!drawMode) return;
        e.preventDefault();
        setIsDrawing(true);
        setDrawStart({ lng: e.lngLat.lng, lat: e.lngLat.lat });
        setDrawEnd({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      },
      [drawMode]
  );

  const handleMapMouseMove = useCallback(
      (e: MapMouseEvent) => {
        if (!isDrawing || !drawMode) return;
        setDrawEnd({ lng: e.lngLat.lng, lat: e.lngLat.lat });
      },
      [isDrawing, drawMode]
  );

  const handleMapMouseUp = useCallback(
      (e: MapMouseEvent) => {
        if (!isDrawing || !drawMode || !drawStart) return;
        setIsDrawing(false);
        const end = { lng: e.lngLat.lng, lat: e.lngLat.lat };
        setDrawEnd(end);

        const minLat = Math.min(drawStart.lat, end.lat);
        const maxLat = Math.max(drawStart.lat, end.lat);
        const minLon = Math.min(drawStart.lng, end.lng);
        const maxLon = Math.max(drawStart.lng, end.lng);

        if (Math.abs(maxLat - minLat) < 0.0001 || Math.abs(maxLon - minLon) < 0.0001) {
          // Too small — ignore
          setDrawStart(null);
          setDrawEnd(null);
          return;
        }

        setNewZone((prev) => ({ ...prev, minLat, maxLat, minLon, maxLon }));
        setDrawMode(false);
        setShowModal(true);
      },
      [isDrawing, drawMode, drawStart]
  );

  // Draft rectangle while drawing
  const draftGeoJSON = drawStart && drawEnd
      ? {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {},
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [drawStart.lng, drawStart.lat],
                  [drawEnd.lng, drawStart.lat],
                  [drawEnd.lng, drawEnd.lat],
                  [drawStart.lng, drawEnd.lat],
                  [drawStart.lng, drawStart.lat],
                ],
              ],
            },
          },
        ],
      }
      : null;

  // ── Zone click ──────────────────────────────────────────────────────────────

  const handleZoneClick = useCallback(
      (e: MapLayerMouseEvent) => {
        if (drawMode) return;
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const id = feat.properties?.id as number;
        const zone = geofences.find((z) => z.id === id);
        if (!zone) return;
        setPopupInfo({
          longitude: e.lngLat.lng,
          latitude: e.lngLat.lat,
          geofence: zone,
        });
      },
      [geofences, drawMode]
  );

  // ── Form / CRUD ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const next: Partial<Record<keyof NewZoneForm, string>> = {};
    if (!newZone.name.trim()) next.name = "Zone name is required.";
    if (newZone.minLat >= newZone.maxLat)
      next.maxLat = "Max Lat must be greater than Min Lat.";
    if (newZone.minLon >= newZone.maxLon)
      next.maxLon = "Max Lon must be greater than Min Lon.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const deriveRadius = (): string => {
    const latDiff = Math.abs(newZone.maxLat - newZone.minLat);
    const lonDiff = Math.abs(newZone.maxLon - newZone.minLon);
    const metres = Math.round(((latDiff + lonDiff) / 2) * 111_000);
    return metres >= 1000 ? `${(metres / 1000).toFixed(1)}km` : `${metres}m`;
  };

  const handleSaveZone = (): void => {
    if (!validate()) return;
    const centreLatStr = ((newZone.minLat + newZone.maxLat) / 2).toFixed(4);
    const centreLonStr = ((newZone.minLon + newZone.maxLon) / 2).toFixed(4);
    const zone: Geofence = {
      id: Date.now(),
      name: newZone.name.trim(),
      type: newZone.type,
      radius: deriveRadius(),
      alerts: 0,
      status: "Active",
      coordinates: `${centreLatStr}, ${centreLonStr}`,
      minLat: newZone.minLat,
      maxLat: newZone.maxLat,
      minLon: newZone.minLon,
      maxLon: newZone.maxLon,
    };
    setGeofences((prev) => [...prev, zone]);
    setNewZone(defaultForm);
    setErrors({});
    setShowModal(false);
    setDrawStart(null);
    setDrawEnd(null);
  };

  const handleDelete = (id: number): void => {
    setGeofences((prev) => prev.filter((g) => g.id !== id));
    if (popupInfo?.geofence.id === id) setPopupInfo(null);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setNewZone(defaultForm);
    setErrors({});
    setDrawStart(null);
    setDrawEnd(null);
  };

  // ── Shared styles ─────────────────────────────────────────────────────────

  const inputClass = `w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors ${
      isDark
          ? "bg-neutral-700 border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)] focus:border-blue-500"
          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
  }`;

  const labelClass = `block text-xs font-medium mb-1 ${
      isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"
  }`;

  const zonesGeoJSON = zonesToGeoJSON(geofences);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
      <div className="p-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Geofencing</h1>
            <p className={`text-sm mt-1 ${isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}`}>
              Manage virtual boundaries and location-based alerts
            </p>
          </div>
          <button

              onClick={() => {
                setDrawMode((d) => !d);
                setDrawStart(null);
                setDrawEnd(null);
              }}

              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-500 ${
                  drawMode
                      ? "bg-blue-900 border-blue-500 text-white"
                      : isDark
                          ? "border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] text-white"
                          : "border-black-500 hover:bg-gray-900 text-white"
              }`}

          >
            <Plus className="w-4 h-4" />
            {drawMode ? "Drawing… (drag to select)" :"Create Geofence " }
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <MapPin className="w-5 h-5 text-blue-600" />,
              bg: "bg-blue-100",
              label: "Total Zones",
              value: geofences.length,
              color: "",
            },
            {
              icon: <MapPin className="w-5 h-5 text-green-600" />,
              bg: "bg-green-100",
              label: "New User Sightings",
              value: geofences.filter((g) => g.status === "Active").length,
              color: "text-green-500",
            },
            {
              icon: <MapPin className="w-5 h-5 text-red-600" />,
              bg: "bg-red-100",
              label: "New Drone Sightings",
              value: geofences.filter((g) => g.type === "High Security").length,
              color: "",
            },
          ].map((stat) => (
              <div
                  key={stat.label}
                  className={`p-4 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-100"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
                  <div>
                    <p className={`text-sm ${isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}`}>
                      {stat.label}
                    </p>
                    <p className={`text-xl font-semibold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* ── INTERACTIVE MAP ─────────────────────────────────────────────────── */}
        <div
            className={`rounded-xl overflow-hidden border ${
                isDark
                    ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]"
                    : "bg-white border-gray-200"
            }`}
        >
          {/* Toolbar */}
          <div
              className={`flex flex-wrap items-center gap-3 px-4 py-3 border-b ${
                  isDark ? "border-[rgba(255,255,255,0.08)]" : "border-gray-200"
              }`}
          >
          <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
            📍 Live Map
          </span>

            <select
                value={filter}
                onChange={(e) => {
                  const v = e.target.value as FilterValue;
                  setFilter(v);
                  fetchSightings(v);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg border outline-none ${
                    isDark
                        ? "bg-neutral-700 border-[rgba(255,255,255,0.1)] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
            >
              <option value="all">All Time</option>
              <option value="hour">Last Hour</option>
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
            </select>

            <button
                onClick={fetchZones}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    isDark
                        ? "border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] text-white"
                        : "border-gray-200 hover:bg-gray-100 text-gray-700"
                }`}
            >
              <RefreshCw className="w-3 h-3" /> Refresh Map
            </button>

            {drawMode && (
                <span className="text-xs text-blue-400 italic">
              Click &amp; drag on the map to draw a rectangle
            </span>
            )}
          </div>

          {/* Map */}
          <div style={{ height: "940px", width: "100%" }}>
            <Map
                ref={mapRef}
                initialViewState={{ longitude: 80.7718, latitude: 7.8731, zoom: 8 }}
                mapStyle={isDark ? MAP_STYLE : MAP_STYLE_LIGHT}
                style={{ width: "100%", height: "100%" }}
                interactiveLayerIds={["zones-fill"]}
                onClick={handleZoneClick}
                onMouseDown={handleMapMouseDown}
                onMouseMove={handleMapMouseMove}
                onMouseUp={handleMapMouseUp}
                cursor={drawMode ? "crosshair" : "auto"}
                dragPan={!drawMode}
            >
              <NavigationControl position="top-right" />

              {/* Existing zones */}
              <Source id="zones" type="geojson" data={zonesGeoJSON}>
                <Layer
                    id="zones-fill"
                    type="fill"
                    paint={{
                      "fill-color": ["get", "fillColor"],
                      "fill-opacity": 0.25,
                    }}
                />
                <Layer
                    id="zones-outline"
                    type="line"
                    paint={{
                      "line-color": ["get", "color"],
                      "line-width": 2,
                    }}
                />
              </Source>

              {/* Draft rectangle while user draws */}
              {draftGeoJSON && (
                  <Source id="draft" type="geojson" data={draftGeoJSON}>
                    <Layer
                        id="draft-fill"
                        type="fill"
                        paint={{ "fill-color": "#60a5fa", "fill-opacity": 0.2 }}
                    />
                    <Layer
                        id="draft-outline"
                        type="line"
                        paint={{
                          "line-color": "#3b82f6",
                          "line-width": 2,
                          "line-dasharray": [4, 2],
                        }}
                    />
                  </Source>
              )}

              {/* Sighting markers */}
              {sightings.map((s, i) => (
                  <Marker key={i} longitude={s.longitude} latitude={s.latitude} anchor="bottom">
                    <div
                        title={`🐘 Sighting at ${new Date(s.timestamp).toLocaleString()}`}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "#f59e0b",
                          border: "2px solid #fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          cursor: "default",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                        }}
                    >
                      🐘
                    </div>
                  </Marker>
              ))}

              {/* Zone popup on click */}
              {popupInfo && (
                  <Popup
                      longitude={popupInfo.longitude}
                      latitude={popupInfo.latitude}
                      anchor="bottom"
                      onClose={() => setPopupInfo(null)}
                      closeOnClick={false}
                      style={{ zIndex: 10 }}
                  >
                    <div style={{ minWidth: 180, fontFamily: "sans-serif", fontSize: 13, color: "black" }}>
                      <strong style={{ fontSize: 14 }}>{popupInfo.geofence.name}</strong>
                      <div style={{ marginTop: 6, lineHeight: 1.7 }}>
                        <div>
                      <span
                          style={{
                            background:
                                popupInfo.geofence.type === "High Security"
                                    ? "#fee2e2"
                                    : popupInfo.geofence.type === "Restricted"
                                        ? "#ffedd5"
                                        : "#dbeafe",
                            color:
                                popupInfo.geofence.type === "High Security"
                                    ? "#b91c1c"
                                    : popupInfo.geofence.type === "Restricted"
                                        ? "#c2410c"
                                        : "#1d4ed8",
                            padding: "1px 6px",
                            borderRadius: 4,
                            fontSize: 11,
                          }}
                      >
                        {popupInfo.geofence.type}
                      </span>{" "}
                          <span
                              style={{
                                background:
                                    popupInfo.geofence.status === "Active" ? "#dcfce7" : "#f3f4f6",
                                color:
                                    popupInfo.geofence.status === "Active" ? "#15803d" : "#374151",
                                padding: "1px 6px",
                                borderRadius: 4,
                                fontSize: 11,
                              }}
                          >
                        {popupInfo.geofence.status}
                      </span>
                        </div>
                        <div>🔵 Radius: {popupInfo.geofence.radius}</div>
                        <div>🔔 Alerts: {popupInfo.geofence.alerts}</div>
                        <div>📍 {popupInfo.geofence.coordinates}</div>
                      </div>
                    </div>
                  </Popup>
              )}
            </Map>
          </div>

          {/* Legend */}
          <div
              className={`flex flex-wrap items-center gap-4 px-4 py-2 text-xs border-t ${
                  isDark
                      ? "border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)]"
                      : "border-gray-100 text-gray-500"
              }`}
          >
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-red-500/60" /> High Security
          </span>
            <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-orange-400/60" /> Restricted
          </span>
            <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-500/60" /> Monitored
          </span>
            <span className="flex items-center gap-1">🐘 Sighting</span>
            <span className="ml-auto">Click a zone to view details · Draw Zone to create by dragging</span>
          </div>
        </div>

        {/* Geofences List */}
        <div className="space-y-3">
          {geofences.map((geofence) => (
              <div
                  key={geofence.id}
                  className={`p-5 rounded-xl border ${
                      isDark
                          ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                  } transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{geofence.name}</h3>
                      <span
                          className={`px-2 py-1 text-xs rounded-md ${
                              geofence.type === "High Security"
                                  ? "bg-red-100 text-red-700"
                                  : geofence.type === "Restricted"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-blue-100 text-blue-700"
                          }`}
                      >
                    {geofence.type}
                  </span>
                      <span
                          className={`px-2 py-1 text-xs rounded-md ${
                              geofence.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                      >
                    {geofence.status}
                  </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                  <span className={isDark ? "text-black-900" : "text-gray-900"}>
                    📍 {geofence.coordinates}
                  </span>
                      <span className={isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}>
                    🔵 Radius: {geofence.radius}
                  </span>
                      <span className={isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}>
                    🔔 {geofence.alerts} alerts
                  </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                        className={`p-2 rounded-lg ${
                            isDark ? "hover:bg-[rgba(255,255,255,0.1)]" : "hover:bg-gray-200"
                        } transition-colors`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(geofence.id)}
                        className={`p-2 rounded-lg ${
                            isDark ? "hover:bg-[rgba(255,255,255,0.1)]" : "hover:bg-gray-200"
                        } transition-colors text-red-500`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Create Geofence Modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={handleCloseModal}
              />
              <div
                  className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl ${
                      isDark
                          ? "bg-[#1c1c1e] border border-[rgba(255,255,255,0.1)]"
                          : "bg-white border border-gray-200"
                  }`}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Create New Geofence</h2>
                  <button
                      onClick={handleCloseModal}
                      className={`p-1.5 rounded-lg ${
                          isDark ? "hover:bg-[rgba(255,255,255,0.1)]" : "hover:bg-gray-100"
                      } transition-colors`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {newZone.minLat !== 0 && (
                    <div
                        className={`mb-4 px-3 py-2 rounded-lg text-xs ${
                            isDark
                                ? "bg-blue-900/40 text-blue-300 border border-blue-800"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                    >
                      ✏️ Bounds auto-filled from map selection
                    </div>
                )}

                <div className="space-y-4">
                  {/* Zone Name */}
                  <div>
                    <label className={labelClass}>Zone Name *</label>
                    <input
                        className={inputClass}
                        placeholder="e.g. Server Room Zone"
                        value={newZone.name}
                        onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Zone Type */}
                  <div>
                    <label className={labelClass}>Zone Type</label>
                    <select
                        className={inputClass }
                        value={newZone.type}
                        onChange={(e) =>
                            setNewZone({ ...newZone, type: e.target.value as GeofenceType })
                        }
                    >
                      <option value="Monitored">Monitored</option>
                      <option value="Restricted">Restricted</option>
                      <option value="High Security">High Security</option>
                    </select>
                  </div>

                  {/* Lat Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Min Latitude *</label>
                      <input
                          className={inputClass}
                          type="number"
                          placeholder="e.g. 40.71"
                          value={newZone.minLat || ""}
                          onChange={(e) =>
                              setNewZone({ ...newZone, minLat: parseFloat(e.target.value) })
                          }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Max Latitude *</label>
                      <input
                          className={inputClass}
                          type="number"
                          placeholder="e.g. 40.72"
                          value={newZone.maxLat || ""}
                          onChange={(e) =>
                              setNewZone({ ...newZone, maxLat: parseFloat(e.target.value) })
                          }
                      />
                      {errors.maxLat && (
                          <p className="text-red-500 text-xs mt-1">{errors.maxLat}</p>
                      )}
                    </div>
                  </div>

                  {/* Lon Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Min Longitude *</label>
                      <input
                          className={inputClass}
                          type="number"
                          placeholder="e.g. -74.01"
                          value={newZone.minLon || ""}
                          onChange={(e) =>
                              setNewZone({ ...newZone, minLon: parseFloat(e.target.value) })
                          }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Max Longitude *</label>
                      <input
                          className={inputClass}
                          type="number"
                          placeholder="e.g. -74.00"
                          value={newZone.maxLon || ""}
                          onChange={(e) =>
                              setNewZone({ ...newZone, maxLon: parseFloat(e.target.value) })
                          }
                      />
                      {errors.maxLon && (
                          <p className="text-red-500 text-xs mt-1">{errors.maxLon}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                      onClick={handleCloseModal}
                      className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                          isDark
                              ? "border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]"
                              : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleSaveZone}
                      className={`flex-1 py-2 rounded-lg text-sm text-white transition-colors ${
                          isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    Save Zone
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}