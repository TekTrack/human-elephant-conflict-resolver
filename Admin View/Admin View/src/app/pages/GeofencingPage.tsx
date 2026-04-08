import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useMapTrigger } from "../context/MapTriggerContext";
import { MapPin, Plus, Edit, Trash2, X, RefreshCw, Check } from "lucide-react";// @ts-ignore
import Map, { Source, Layer, Marker, Popup, NavigationControl } from "react-map-gl/maplibre";
import type { MapRef, MapLayerMouseEvent, MapMouseEvent } from "react-map-gl/maplibre";

import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";

// ── Types ─────────────────────────────────────────────────────────────────────
type GeofenceType = "Caution" | "Monitored" | "Danger";
type GeofenceStatus = "Active" | "Inactive";
type FilterValue = "all" | "hour" | "day" | "week";

interface Geofence {
    id: number;
    name: string;
    type: GeofenceType;
    //radius: string;
    alerts: number;
    status: GeofenceStatus;
    coordinates: string;
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
    lastSightingDate: number; 
}

interface Sighting {
    id: number;
    photoFilename: string;
    verified: boolean;
    latitude: number;
    longitude: number;
    timestamp: string;
    source: "user" | "drone";
    droneId:number;
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
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const MAP_STYLE_LIGHT = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const defaultForm: NewZoneForm = { name: "", type: "Monitored", minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };

// const DUMMY_SIGHTINGS: Sighting[] = [
//     {latitude: 40.714, longitude: -74.006, timestamp: new Date().toISOString(), type: "user"},
//     {latitude: 40.712, longitude: -74.008, timestamp: new Date(Date.now() - 3_600_000).toISOString(), type: "drone"},
//     {latitude: 40.716, longitude: -74.003, timestamp: new Date(Date.now() - 86_400_000).toISOString(), type: "user"},
// ];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getZoneColor(type: GeofenceType): string {
    if (type === "Danger") return "#ef4444";
    if (type === "Caution") return "#f97316";
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

export function GeofencingPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const mapRef = useRef<MapRef>(null);
    const { mapTrigger, BASE_URL } = useMapTrigger();

    // ── State ───────────────────────────────────────────────────────────────────
    const [geofences, setGeofences] = useState<Geofence[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newZone, setNewZone] = useState<NewZoneForm>(defaultForm);
    const [errors, setErrors] = useState<Partial<Record<keyof NewZoneForm, string>>>({});

    const [filter, setFilter] = useState<FilterValue>("all");
    const [sightings, setSightings] = useState<Sighting[]>();
    const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [drawStart, setDrawStart] = useState<{ lng: number; lat: number } | null>(null);
    const [drawEnd, setDrawEnd] = useState<{ lng: number; lat: number } | null>(null);
    const [drawMode, setDrawMode] = useState(false);

    const [showUserSightings, setShowUserSightings] = useState(true);
    const [showDroneSightings, setShowDroneSightings] = useState(true);

    // ── Logic Functions ────────────────────────────────────────────────────────
    // const fetchSightings = useCallback((f: FilterValue) => {
    //     const now = Date.now();
    //     const cutoffs: Record<FilterValue, number> = {
    //         all: 0,
    //         hour: now - 3_600_000,
    //         day: now - 86_400_000,
    //         week: now - 604_800_000
    //     };
    //     setSightings(DUMMY_SIGHTINGS.filter((s) => new Date(s.timestamp).getTime() >= cutoffs[f]));
    // }, []);

    const fetchSightings = async (filter: FilterValue) => {
        const token = localStorage.getItem('authToken'); // Grab the saved token
        const res = await fetch(`${BASE_URL}/sightings/filter?timeframe=${filter}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        setSightings(data);
    };

    const checkZoneBreached = (zones: Geofence[]) => {
        zones.forEach((zone) => {
            if (!zone.lastSightingDate) {
                zone.type = "Monitored";
                return;
            }
            const now = new Date().getTime();
            const sighting = new Date(zone.lastSightingDate).getTime();     
            const hoursSince = (now - sighting) / (1000 * 60 * 60);

            if (hoursSince < 24) {
                zone.type = "Danger";
            } else {
                zone.type = "Caution";
            }
        });
    };

    const completeFetchZones = (data: Geofence[]) => {
        const formattedZones = data.map((zone) => ({
            ...zone,
            //radius: zone.radius || "0m", 
            status: zone.status || "Active",
            coordinates: `${((zone.minLat + zone.maxLat) / 2).toFixed(4)}, ${((zone.minLon + zone.maxLon) / 2).toFixed(4)}`
        }));
        checkZoneBreached(formattedZones);
        return formattedZones;
    };

    const fetchZones = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${BASE_URL}/zones`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setGeofences(completeFetchZones(data));
            } else {
                console.error('Failed to fetch zones');
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchSightings(filter);
        fetchZones();
    }, [filter, mapTrigger]);


    const handleMapMouseDown = useCallback((e: MapMouseEvent) => {
        if (!drawMode) return;
        e.preventDefault();
        setIsDrawing(true);
        setDrawStart({ lng: e.lngLat.lng, lat: e.lngLat.lat });
        setDrawEnd({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    }, [drawMode]);

    const handleMapMouseMove = useCallback((e: MapMouseEvent) => {
        if (!isDrawing || !drawMode) return;
        setDrawEnd({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    }, [isDrawing, drawMode]);

    const handleMapMouseUp = useCallback((e: MapMouseEvent) => {
        if (!isDrawing || !drawMode || !drawStart) return;
        setIsDrawing(false);
        const end = { lng: e.lngLat.lng, lat: e.lngLat.lat };
        setDrawEnd(end);

        const minLat = Math.min(drawStart.lat, end.lat);
        const maxLat = Math.max(drawStart.lat, end.lat);
        const minLon = Math.min(drawStart.lng, end.lng);
        const maxLon = Math.max(drawStart.lng, end.lng);

        if (Math.abs(maxLat - minLat) < 0.0001 || Math.abs(maxLon - minLon) < 0.0001) {
            setDrawStart(null);
            setDrawEnd(null);
            return;
        }

        setNewZone((prev) => ({ ...prev, minLat, maxLat, minLon, maxLon }));
        setDrawMode(false);
        setShowModal(true);
    }, [isDrawing, drawMode, drawStart]);

    const handleZoneClick = useCallback((e: MapLayerMouseEvent) => {
        if (drawMode) return;
        if (!e.features || e.features.length === 0) return;
        const id = e.features[0].properties?.id as number;
        const zone = geofences.find((z) => z.id === id);
        if (!zone) return;
        setPopupInfo({ longitude: e.lngLat.lng, latitude: e.lngLat.lat, geofence: zone });
    }, [geofences, drawMode]);

    const validate = (): boolean => {
        const next: Partial<Record<keyof NewZoneForm, string>> = {};
        if (!newZone.name.trim()) next.name = "Zone name is required.";
        if (newZone.minLat >= newZone.maxLat) next.maxLat = "Max Lat must be greater than Min Lat.";
        if (newZone.minLon >= newZone.maxLon) next.maxLon = "Max Lon must be greater than Min Lon.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    // const deriveRadius = (): string => {
    //     const latDiff = Math.abs(newZone.maxLat - newZone.minLat);
    //     const lonDiff = Math.abs(newZone.maxLon - newZone.minLon);
    //     const metres = Math.round(((latDiff + lonDiff) / 2) * 111_000);
    //     return metres >= 1000 ? `${(metres / 1000).toFixed(1)}km` : `${metres}m`;
    // };

    const saveZoneToDatabase = async (newZone: Geofence) => {
        try {
            const zoneData = {
                name: newZone.name,
                type: newZone.type,
                minLat: newZone.minLat,
                maxLat: newZone.maxLat,
                minLon: newZone.minLon,
                maxLon: newZone.maxLon
            };
            const token = localStorage.getItem('authToken'); // Grab the saved token
            const res = await fetch(`${BASE_URL}/zones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    , 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(zoneData)
            });

            const data = await res.json();
            console.log(`✅ Zone saved: ${data.name}`);
            fetchZones(); // Refresh the active zones
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveZone = (): void => {
        if (!validate()) return;
        const centreLatStr = ((newZone.minLat + newZone.maxLat) / 2).toFixed(4);
        const centreLonStr = ((newZone.minLon + newZone.maxLon) / 2).toFixed(4);
        const zone: Geofence = {
            id: Date.now(),
            name: newZone.name.trim(),
            type: newZone.type,
            // radius: deriveRadius(),
            alerts: 0,
            status: "Active",
            coordinates: `${centreLatStr}, ${centreLonStr}`,
            minLat: newZone.minLat, maxLat: newZone.maxLat, minLon: newZone.minLon, maxLon: newZone.maxLon,
            lastSightingDate: 0
        };
        setGeofences((prev) => [...prev, zone]);
        saveZoneToDatabase(zone);
        handleCloseModal();
    };

    const handleDelete = async (id: number): Promise<void> => {
        try {
            const token = localStorage.getItem('authToken'); // Grab the saved token
            const res = await fetch(`${BASE_URL}/zones/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                window.alert('Failed to delete zone');
            }

            fetchZones();}
        catch (err) {
            console.error(err);
        }
    };    


    const handleCloseModal = (): void => {
        setShowModal(false);
        setNewZone(defaultForm);
        setErrors({});
        setDrawStart(null);
        setDrawEnd(null);
    };

    // ── Render Helpers ─────────────────────────────────────────────────────────
    const getVariant = (type: string) => {
        if (type === "Danger") return "critical";
        if (type === "CautionF") return "warning";
        if (type === "Active") return "success";
        if (type === "Inactive") return "neutral";
        return "info";
    };

    const zonesGeoJSON = zonesToGeoJSON(geofences);
    const draftGeoJSON = drawStart && drawEnd ? {
        type: "FeatureCollection" as const,
        features: [{
            type: "Feature" as const, properties: {}, geometry: {
                type: "Polygon" as const,
                coordinates: [[[drawStart.lng, drawStart.lat], [drawEnd.lng, drawStart.lat], [drawEnd.lng, drawEnd.lat], [drawStart.lng, drawEnd.lat], [drawStart.lng, drawStart.lat]]],
            },
        }],
    } : null;

    return (
        <div className="p-8 space-y-6">
            <PageHeader
                title="Geofencing"
                description="Manage virtual boundaries and location-based alerts"
                actions={
                    <Button
                        variant={drawMode ? "primary" : "secondary"}
                        onClick={() => {
                            setDrawMode((d) => !d);
                            setDrawStart(null);
                            setDrawEnd(null);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        {drawMode ? "Drawing… (drag to select)" : "Create Geofence"}
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Zones" value={geofences.length}
                    icon={<MapPin className="w-5 h-5 text-blue-600" />} iconBgClass="bg-blue-100" />
                <StatCard label="New User Sightings" value={geofences.filter((g) => g.status === "Active").length}
                    icon={<MapPin className="w-5 h-5 text-green-600" />} iconBgClass="bg-green-100"
                    valueColorClass="text-green-500" />
                <StatCard label="New Drone Sightings" value={geofences.filter((g) => g.type === "Danger").length}
                    icon={<MapPin className="w-5 h-5 text-red-600" />} iconBgClass="bg-red-100" />
            </div>

            {/* Interactive Map Wrapper */}
            <Card noPadding className="overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className={`flex items-center w-full gap-20 px-4 py-4 border-b overflow-x- no-scrollbar ${isDark ? "border-[rgba(255,255,255,0.08)]" : "border-gray-200"}`}>

                    {/* Map Title */}
                    <span className={`text-sm font-medium shrink-0 ${isDark ? "text-white" : "text-gray-700"}`}>
                        Live Map
                    </span>

                    {/* Time Filter */}
                    <Select
                        className="w-px-1 pl-5 pr-6 py-1.5 text-xs font-medium shrink-0"
                        value={filter}
                        onChange={(e) => { const v = e.target.value as FilterValue; setFilter(v); fetchSightings(v); }}
                    >
                        <option value="all">All Time</option>
                        <option value="hour">Last Hour</option>
                        <option value="day">Last 24 Hours</option>
                        <option value="week">Last Week</option>
                    </Select>

                    {/* User Sightings */}
                    <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none group shrink-0">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={showUserSightings}
                            onChange={(e) => setShowUserSightings(e.target.checked)}
                        />
                        <div className={`flex items-center justify-center w-4 h-4 rounded transition-all duration-200 ${showUserSightings
                            ? "bg-blue-500 border-transparent shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                            : isDark
                                ? "border border-[rgba(255,255,255,0.3)] group-hover:border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.05)]"
                                : "border border-gray-300 group-hover:border-gray-400 bg-white"
                            }`}>
                            {showUserSightings && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className={`font-medium transition-colors ${isDark
                            ? (showUserSightings ? "text-white" : "text-[rgba(255,255,255,0.5)] group-hover:text-[rgba(255,255,255,0.8)]")
                            : (showUserSightings ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700")
                            }`}>
                            User Sightings
                        </span>
                    </label>

                    {/* Drone Sightings */}
                    <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none group shrink-0">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={showDroneSightings}
                            onChange={(e) => setShowDroneSightings(e.target.checked)}
                        />
                        <div className={`flex items-center justify-center w-4 h-4 rounded transition-all duration-200 ${showDroneSightings
                            ? "bg-red-500 border-transparent shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                            : isDark
                                ? "border border-[rgba(255,255,255,0.3)] group-hover:border-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.05)]"
                                : "border border-gray-300 group-hover:border-gray-400 bg-white"
                            }`}>
                            {showDroneSightings && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className={`font-medium transition-colors ${isDark
                            ? (showDroneSightings ? "text-white" : "text-[rgba(255,255,255,0.5)] group-hover:text-[rgba(255,255,255,0.8)]")
                            : (showDroneSightings ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700")
                            }`}>
                            Drone Sightings
                        </span>
                    </label>

                    {/* Refresh Button (ml-auto pushes it all the way to the right) */}
                    <Button variant="secondary" className="py-1.5 px-3 text-xs ml-auto shrink-0" onClick={fetchZones}>
                        <RefreshCw className="w-3 h-3" /> Refresh Map
                    </Button>
                </div>

                {/* Draw Mode Banner (Moved outside the flex row so it doesn't mess up the layout) */}
                {drawMode && (
                    <div className={`w-full px-4 py-2 border-b ${isDark ? "bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.2)]" : "bg-blue-50 border-blue-100"}`}>
                        <span className="text-xs text-blue-500 font-medium">✏️ Click &amp; drag on the map to draw a rectangle</span>
                    </div>
                )}

                {/* Map Container */}
                <div style={{ height: "600px", width: "100%" }}>
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
                        <Source id="zones" type="geojson" data={zonesGeoJSON}>
                            <Layer id="zones-fill" type="fill"
                                paint={{ "fill-color": ["get", "fillColor"], "fill-opacity": 0.25 }} />
                            <Layer id="zones-outline" type="line"
                                paint={{ "line-color": ["get", "color"], "line-width": 2 }} />
                        </Source>
                        {draftGeoJSON && (
                            <Source id="draft" type="geojson" data={draftGeoJSON}>
                                <Layer id="draft-fill" type="fill"
                                    paint={{ "fill-color": "#60a5fa", "fill-opacity": 0.2 }} />
                                <Layer id="draft-outline" type="line"
                                    paint={{ "line-color": "#3b82f6", "line-width": 2, "line-dasharray": [4, 2] }} />
                            </Source>
                        )}
                        {(sightings || [])
                            .filter((s) => {
                                // Filter out if it's a user sighting and the user box is unchecked
                                if (s.source === "user" && !showUserSightings) return false;
                                // Filter out if it's a drone sighting and the drone box is unchecked
                                if (s.source === "drone" && !showDroneSightings) return false;
                                // Otherwise, show it
                                return true;
                            })
                            .map((s, i) => (
                                <Marker key={i} longitude={s.longitude} latitude={s.latitude} anchor="bottom">
                                    <div
                                        title={`${s.source === 'drone' ? '🚁' : '👤'} Sighting at ${new Date(s.timestamp).toLocaleString()}`}
                                        className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-md cursor-default ${s.source === 'drone' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}
                                    >
                                        {s.source === 'drone' ? '🚁' : '👤'}
                                    </div>
                                </Marker>
                            ))
                        }
                        {popupInfo && (
                            <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} anchor="bottom"
                                onClose={() => setPopupInfo(null)} closeOnClick={true} closeButton={true} style={{ zIndex: 10 }}>
                                <div style={{ minWidth: 180, fontFamily: "sans-serif", fontSize: 13, color: "black" }}>
                                    <strong style={{ fontSize: 14 }}>{popupInfo.geofence.name}</strong>
                                    <div style={{ marginTop: 6, lineHeight: 1.7 }}>
                                        <div className="flex gap-2">
                                            <Badge
                                                variant={getVariant(popupInfo.geofence.type) as any}>{popupInfo.geofence.type}</Badge>
                                            <Badge
                                                variant={getVariant(popupInfo.geofence.status) as any}>{popupInfo.geofence.status}</Badge>
                                        </div>
                                        {/* <div className="mt-2">🔵 Radius: {popupInfo.geofence.radius}</div> */}
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
                    className={`flex flex-wrap items-center gap-4 px-4 py-2 text-xs border-t ${isDark ? "border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)]" : "border-gray-100 text-gray-500"}`}>
                    <span className="flex items-center gap-1"><span
                        className="inline-block w-3 h-3 rounded-sm bg-red-500/60" /> Danger</span>
                    <span className="flex items-center gap-1"><span
                        className="inline-block w-3 h-3 rounded-sm bg-orange-400/60" /> Caution</span>
                    <span className="flex items-center gap-1"><span
                        className="inline-block w-3 h-3 rounded-sm bg-blue-500/60" /> Monitored</span>
                    <span className="ml-auto">Click a zone to view details · Draw Zone to create by dragging</span>
                </div>
            </Card>

            {/* Geofences List */}
            <div className="space-y-3">
                {geofences.map((geofence) => (
                    <Card key={geofence.id} className="p-5" hoverable>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-black dark:text-white">{geofence.name}</h3>
                                    <Badge variant={getVariant(geofence.type) as any}>{geofence.type}</Badge>
                                    <Badge variant={getVariant(geofence.status) as any}>{geofence.status}</Badge>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <span className="text-black dark:text-white">📍 {geofence.coordinates}</span>
                                    {/* <span
                                            // className="text-gray-600 dark:text-[rgba(255,255,255,0.6)]">🔵 Radius: {geofence.radius}</span> */}
                                    <span
                                        className="text-gray-600 dark:text-[rgba(255,255,255,0.6)]">🔔 {geofence.alerts} alerts</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" className="p-2"><Edit className="w-4 h-4" /></Button>
                                <Button variant="dangerIcon" className="p-2"
                                    onClick={() => handleDelete(geofence.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create Geofence Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />

                    <Card className="relative w-full max-w-md p-6 shadow-2xl z-10" noPadding={false}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-black dark:text-white">Create New Geofence</h2>
                            <Button variant="ghost" className="p-1.5" onClick={handleCloseModal}><X
                                className="w-4 h-4" /></Button>
                        </div>

                        {newZone.minLat !== 0 && (
                            <div
                                className={`mb-4 px-3 py-2 rounded-lg text-xs ${isDark ? "bg-blue-900/40 text-blue-300 border border-blue-800" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                                ✏️ Bounds auto-filled from map selection
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Zone Name *"
                                placeholder="e.g. Server Room Zone"
                                value={newZone.name}
                                onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                                error={errors.name}
                            />

                            <Select label="Zone Type" value={newZone.type}
                                onChange={(e) => setNewZone({ ...newZone, type: e.target.value as GeofenceType })}>
                                <option value="Monitored">Monitored</option>
                                <option value="Caution">Caution</option>
                                <option value="Danger">Danger</option>
                            </Select>

                            <div className="grid grid-cols-2 gap-3">
                                <Input type="number" label="Min Latitude *" placeholder="e.g. 40.71"
                                    value={newZone.minLat || ""}
                                    onChange={(e) => setNewZone({ ...newZone, minLat: parseFloat(e.target.value) })} />
                                <Input type="number" label="Max Latitude *" placeholder="e.g. 40.72"
                                    value={newZone.maxLat || ""} error={errors.maxLat}
                                    onChange={(e) => setNewZone({ ...newZone, maxLat: parseFloat(e.target.value) })} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input type="number" label="Min Longitude *" placeholder="e.g. -74.01"
                                    value={newZone.minLon || ""}
                                    onChange={(e) => setNewZone({ ...newZone, minLon: parseFloat(e.target.value) })} />
                                <Input type="number" label="Max Longitude *" placeholder="e.g. -74.00"
                                    value={newZone.maxLon || ""} error={errors.maxLon}
                                    onChange={(e) => setNewZone({ ...newZone, maxLon: parseFloat(e.target.value) })} />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button variant="secondary" className="flex-1" onClick={handleCloseModal}>Cancel</Button>
                            <Button variant="primary" className="flex-1" onClick={handleSaveZone}>Save Zone</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}