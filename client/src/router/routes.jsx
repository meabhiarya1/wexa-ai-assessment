import { ConnectPage } from "../pages/ConnectPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { ExplorePage } from "../pages/ExplorePage.jsx";
import { PeoplePage } from "../pages/PeoplePage.jsx";
import { ProjectsPage } from "../pages/ProjectsPage.jsx";
import { navItems } from "./navItems.jsx";

const pages = {
  "/dashboard": DashboardPage,
  "/people": PeoplePage,
  "/projects": ProjectsPage,
  "/connect": ConnectPage,
  "/explore": ExplorePage
};

export function normalizeRoute(pathname) {
  const knownRoutes = navItems.map((item) => item.path);
  return knownRoutes.includes(pathname) ? pathname : "/dashboard";
}

export function getActivePage(route) {
  return pages[route] || DashboardPage;
}
