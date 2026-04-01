import { createBrowserRouter } from "react-router";
import { FigmaAdminLayout } from "./components/FigmaAdminLayout";
import { OverviewPage } from "./components/OverviewPage";
import { SightingAlertsPage } from "./components/SightingAlertsPage";
import { LiveMonitorPage } from "./components/LiveMonitorPage";
import { AlertMapPage } from "./components/AlertMapPage";
import { UserDirectoryPage } from "./components/UserDirectoryPage";
import { GeofencingPage } from "./components/GeofencingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: FigmaAdminLayout,
    children: [
      { index: true, Component: OverviewPage },
      { path: "sighting-alerts", Component: SightingAlertsPage },
      { path: "live-monitor", Component: LiveMonitorPage },
      { path: "alert-map", Component: AlertMapPage },
      { path: "user-directory", Component: UserDirectoryPage },
      { path: "geofencing", Component: GeofencingPage },
    ],
  },
]);