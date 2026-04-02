import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { MapPin, Plus, Edit, Trash2, Shield, X } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type GeofenceType = "Restricted" | "Monitored" | "High Security";
type GeofenceStatus = "Active" | "Inactive";

interface Geofence {
  id: number;
  name: string;
  type: GeofenceType;
  radius: string;
  alerts: number;
  status: GeofenceStatus;
  coordinates: string;
}

interface NewZoneForm {
  name: string;
  type: GeofenceType;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

// ── Default form state ────────────────────────────────────────────────────────

const defaultForm: NewZoneForm = {
  name: "",
  type: "Monitored",
  minLat: 0,
  maxLat: 0,
  minLon: 0,
  maxLon: 0,
};

// ── Component ─────────────────────────────────────────────────────────────────

export function GeofencingPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [geofences, setGeofences] = useState<Geofence[]>([
    {
      id: 1,
      name: "Main Building Perimeter",
      type: "Restricted",
      radius: "500m",
      alerts: 12,
      status: "Active",
      coordinates: "40.7128, -74.0060",
    },
    {
      id: 2,
      name: "Parking Lot Area",
      type: "Monitored",
      radius: "250m",
      alerts: 5,
      status: "Active",
      coordinates: "40.7138, -74.0070",
    },
    {
      id: 3,
      name: "Server Room Zone",
      type: "High Security",
      radius: "100m",
      alerts: 8,
      status: "Active",
      coordinates: "40.7118, -74.0050",
    },
    {
      id: 4,
      name: "Emergency Exit Routes",
      type: "Monitored",
      radius: "150m",
      alerts: 3,
      status: "Inactive",
      coordinates: "40.7148, -74.0080",
    },
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [newZone, setNewZone] = useState<NewZoneForm>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof NewZoneForm, string>>>({});

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const next: Partial<Record<keyof NewZoneForm, string>> = {};

    if (!newZone.name.trim()) next.name = "Zone name is required.";
    if (newZone.minLat >= newZone.maxLat) next.maxLat = "Max Lat must be greater than Min Lat.";
    if (newZone.minLon >= newZone.maxLon) next.maxLon = "Max Lon must be greater than Min Lon.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const deriveRadius = (): string => {
    const latDiff = Math.abs(newZone.maxLat - newZone.minLat);
    const lonDiff = Math.abs(newZone.maxLon - newZone.minLon);
    const avgDeg = (latDiff + lonDiff) / 2;
    const metres = Math.round(avgDeg * 111_000);
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
    };

    setGeofences((prev) => [...prev, zone]);
    setNewZone(defaultForm);
    setErrors({});
    setShowModal(false);
  };

  const handleDelete = (id: number): void => {
    setGeofences((prev) => prev.filter((g) => g.id !== id));
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setNewZone(defaultForm);
    setErrors({});
  };

  // ── Shared styles ─────────────────────────────────────────────────────────────

  const inputClass = `w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors ${
      isDark
          ? "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)] focus:border-blue-500"
          : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
  }`;

  const labelClass = `block text-xs font-medium mb-1 ${
      isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"
  }`;

  // ── Render ────────────────────────────────────────────────────────────────────

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
              onClick={() => setShowModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
          >
            <Plus className="w-4 h-4" />
            Create Geofence
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: <MapPin className="w-5 h-5 text-blue-600" />,
              bg: "bg-blue-100",
              label: "Total Zones",
              value: geofences.length,
              color: "",
            },
            {
              icon: <Shield className="w-5 h-5 text-green-600" />,
              bg: "bg-green-100",
              label: "Active",
              value: geofences.filter((g) => g.status === "Active").length,
              color: "text-green-500",
            },
            {
              icon: <Shield className="w-5 h-5 text-red-600" />,
              bg: "bg-red-100",
              label: "High Security",
              value: geofences.filter((g) => g.type === "High Security").length,
              color: "",
            },
            {
              icon: <MapPin className="w-5 h-5 text-yellow-600" />,
              bg: "bg-yellow-100",
              label: "Total Alerts",
              value: geofences.reduce((acc, g) => acc + g.alerts, 0),
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

        {/* Map Visualization */}
        <div
            className={`rounded-xl overflow-hidden border h-[400px] ${
                isDark
                    ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]"
                    : "bg-white border-gray-200"
            }`}
        >
          <div className={`w-full h-full ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"} relative`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                <p className={isDark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-500"}>
                  Geofence Map Visualization
                </p>
                <p className={`text-sm mt-2 ${isDark ? "text-[rgba(255,255,255,0.3)]" : "text-gray-400"}`}>
                  All geofence boundaries would be displayed here
                </p>
              </div>
            </div>
            <div className="absolute top-1/4 left-1/3">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-red-500/30 bg-red-500/10" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 bg-blue-500/10" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>
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
                  <span className={isDark ? "text-[rgba(255,255,255,0.6)]" : "text-gray-600"}>
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
              {/* Backdrop */}
              <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={handleCloseModal}
              />

              {/* Modal */}
              <div
                  className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl ${
                      isDark ? "bg-[#1c1c1e] border border-[rgba(255,255,255,0.1)]" : "bg-white border border-gray-200"
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

                {/* Form */}
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
                        className={inputClass}
                        value={newZone.type}
                        onChange={(e) => setNewZone({ ...newZone, type: e.target.value as GeofenceType })}
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
                          onChange={(e) => setNewZone({ ...newZone, minLat: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Max Latitude *</label>
                      <input
                          className={inputClass}
                          type="number"
                          placeholder="e.g. 40.72"
                          value={newZone.maxLat || ""}
                          onChange={(e) => setNewZone({ ...newZone, maxLat: parseFloat(e.target.value) })}
                      />
                      {errors.maxLat && <p className="text-red-500 text-xs mt-1">{errors.maxLat}</p>}
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
                          onChange={(e) => setNewZone({ ...newZone, minLon: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Max Longitude *</label>
                      <input
                          className={inputClass}
                          type="number"
                          placeholder="e.g. -74.00"
                          value={newZone.maxLon || ""}
                          onChange={(e) => setNewZone({ ...newZone, maxLon: parseFloat(e.target.value) })}
                      />
                      {errors.maxLon && <p className="text-red-500 text-xs mt-1">{errors.maxLon}</p>}
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