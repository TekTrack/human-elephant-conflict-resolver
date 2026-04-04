import { createBrowserRouter } from "react-router";
import { FigmaAdminLayout } from "./pages/FigmaAdminLayout.tsx";
import { OverviewPage } from "./pages/OverviewPage.tsx";
import { SightingAlertsPage } from "./pages/SightingAlertsPage.tsx";
import { LiveMonitorPage } from "./pages/LiveMonitorPage.tsx";
import { AlertMapPage } from "./pages/AlertMapPage.tsx";
import { UserDirectoryPage } from "./pages/UserDirectoryPage.tsx";
import { GeofencingPage } from "./pages/GeofencingPage.tsx";

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