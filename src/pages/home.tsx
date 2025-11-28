import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import {
  Plus,
  Plane,
  MapPin,
  Clock,
  Edit,
  Trash2,
  Search,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RouteCard from "../components/molecules/route-card";
import { createPageUrl } from "../utils";
import { Link } from "react-router-dom";
import { routeStorage } from "../utils/storage";
import MapView from "../components/organisms/map-view";
import { useTranslation } from "react-i18next";
import { MAP_CENTER } from "@/utils/constants";

export default function Home() {
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = () => {
    const allRoutes = routeStorage.getAllRoutes();
    setRoutes(allRoutes);
  };

  const createNewRoute = () => {
    const newRoute = routeStorage.createNewRoute();
    window.location.href = createPageUrl(`planner?routeId=${newRoute.id}`);
  };

  const deleteRoute = (routeId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this route?")) {
      routeStorage.deleteRoute(routeId);
      loadRoutes();
    }
  };

  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
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
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[#d7e9f7]/70 via-[#dce8f2]/60 to-[#e7f1fd]/70"></div>

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
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center bg-slate-900/80 backdrop-blur-xl border border-white/30 rounded-3xl px-8 py-6 mb-6 shadow-2xl">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-4 rounded-2xl mr-4">
              <Plane className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">{t("home.title", "Flight Route Planner")}</h1>
              <p className="text-white/70 text-lg mt-1">{t("home.subtitle", "Manage and create your flight routes")}</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Create */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("home.search_placeholder", "Search routes...")}
              className="pl-12 bg-slate-900/60 backdrop-blur-xl border-white/30 text-white placeholder:text-white/50 h-14 text-lg rounded-2xl"
            />
          </div>
            <Button
            onClick={createNewRoute}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-14 px-8 text-lg rounded-2xl shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("home.create", "Create New Route")}
          </Button>
        </motion.div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <RouteCard
                  route={route}
                  index={index}
                  onDelete={deleteRoute}
                  startHref={createPageUrl(`tracker?routeId=${route.id}`)}
                  editHref={createPageUrl(`planner?routeId=${route.id}`)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredRoutes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-16 inline-block">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {searchQuery ? t("home.no_routes_found", "No routes found") : t("home.no_routes_yet", "No routes yet")}
              </h3>
              <p className="text-white/70 mb-6 max-w-md">
                {searchQuery
                  ? t("home.try_adjust_search", "Try adjusting your search query")
                  : t("home.create_first_desc", "Create your first flight route to get started")}
              </p>
              {!searchQuery && (
                <Button
                  onClick={createNewRoute}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t("home.create_first", "Create First Route")}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
