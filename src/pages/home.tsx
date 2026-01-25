import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Plus, Plane } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RouteCard from "../components/molecules/route-card";
import { createPageUrl } from "../utils";
import { routeStorage } from "../utils/storage";
import MapView from "../components/organisms/map-view";
import { useTranslation } from "react-i18next";
import { MAP_CENTER } from "@/utils/constants";
import ThemeToggle from "../components/atoms/theme-toggle";
import type { RouteData } from "../types";

export default function Home() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const { t, i18n } = useTranslation();

  const loadRoutes = useCallback(() => {
    const allRoutes = routeStorage.getAllRoutes() as RouteData[];
    setRoutes(allRoutes);
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const createNewRoute = () => {
    const newRoute = routeStorage.createNewRoute() as RouteData;
    window.location.href = createPageUrl(`planner?routeId=${newRoute.id}`);
  };

  const deleteRoute = (routeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this route?")) {
      routeStorage.deleteRoute(routeId);
      loadRoutes();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" data-testid="main-content">
      {/* Static Map Background */}
      <div className="absolute inset-0 z-0">
        <MapView
          center={MAP_CENTER}
          zoom={MAP_CENTER.zoom}
          waypoints={[]}
          currentPosition={null}
          showAirspace={false}
          showWaypoints={false}
          showAircraft={false}
          showPolyline={false}
          interactive={false}
          tileUrl="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          tileAttribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-[1] bg-app-overlay"></div>

      <style>{`
      .map-tiles-light-blue {
          filter: hue-rotate(190deg) saturate(0.3) brightness(1.1);
        }
        .leaflet-container {
          background: #e8f4fc;
        }
      `}</style>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center"
          >
            <div
              className="flex items-center justify-center bg-header backdrop-blur-xl border border-app-secondary rounded-2xl px-5 py-3 shadow-lg w-full"
              data-testid="header"
            >
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-2 rounded-xl mr-3">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <h1 className="text-xl font-semibold text-header" data-testid="header-title">
                  {t("home.title", "Flight Route Planner")}
                </h1>
                <p className="text-sm mt-0.5 text-header-secondary">
                  {t("home.subtitle", "Manage and create your flight routes")}
                </p>
              </div>
              <ThemeToggle />
              <nav
                className="ml-4 flex items-center gap-1.5"
                data-testid="language-selector"
                aria-label="Language selector"
              >
                {[
                  { code: "en", label: "EN" },
                  { code: "es", label: "ES" },
                  { code: "ca", label: "CA" },
                ].map((lng) => {
                  const active = (i18n.language || "").startsWith(lng.code);
                  return (
                    <Button
                      key={lng.code}
                      variant="ghost"
                      size="sm"
                      onClick={() => i18n.changeLanguage(lng.code)}
                      data-testid={`language-button-${lng.code}`}
                      className={`text-header rounded-lg px-2 py-1 text-xs ${
                        active ? "opacity-100 bg-white/20" : "opacity-70 hover:bg-white/10"
                      }`}
                    >
                      {lng.label}
                    </Button>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        </div>

        {/* Routes Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="routes-grid"
        >
          <AnimatePresence>
            {routes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <RouteCard
                  route={route}
                  onDelete={deleteRoute}
                  startHref={`/tracker?routeId=${route.id}`}
                  editHref={`/planner?routeId=${route.id}`}
                />
              </motion.div>
            ))}

            {/* Create New Route Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: routes.length * 0.05 }}
              onClick={createNewRoute}
              className="bg-create-card hover:bg-create-card-hover backdrop-blur-xl border-2 border-dashed border-app-secondary rounded-3xl overflow-hidden hover:scale-105 hover:border-emerald-500/50 transition-all duration-300 shadow-xl cursor-pointer group flex items-center justify-center min-h-full"
              data-testid="create-route-card"
            >
              <div className="p-6 text-center">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-create-card mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  {t("home.create", "Create New Route")}
                </h3>
                <p className="text-sm text-create-card-secondary">
                  {t("home.create_desc", "Start planning your next flight")}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
