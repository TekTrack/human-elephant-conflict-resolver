import { createContext, useContext, ReactNode } from "react";

interface MapTriggerContextType {
  mapTrigger: number;
  setMapTrigger: (value: number | ((prev: number) => number)) => void;
  BASE_URL: string;
}

const MapTriggerContext = createContext<MapTriggerContextType | undefined>(undefined);

export function MapTriggerProvider({ children, mapTrigger, setMapTrigger, BASE_URL }: { children: ReactNode; mapTrigger: number; setMapTrigger: (value: number | ((prev: number) => number)) => void; BASE_URL: string }) {
  return (
    <MapTriggerContext.Provider value={{ mapTrigger, setMapTrigger, BASE_URL }}>
      {children}
    </MapTriggerContext.Provider>
  );
}

export function useMapTrigger() {
  const context = useContext(MapTriggerContext);
  if (!context) {
    throw new Error("useMapTrigger must be used within MapTriggerProvider");
  }
  return context;
}