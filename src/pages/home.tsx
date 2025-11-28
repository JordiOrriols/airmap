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
import { createPageUrl } from "../utils";
import { Link } from "react-router-dom";
import { routeStorage } from "../utils/storage";

export default function Home() {
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = () => {
    const allRoutes = routeStorage.getAllRoutes();
    setRoutes(allRoutes);
  };

  const createNewRoute = () => {
    const newRoute = routeStorage.createNewRoute();
    window.location.href = createPageUrl(
      `FlightPlanner?routeId=${newRoute.id}`
    );
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
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#7c3aed] to-[#2563eb] animate-gradient-shift relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
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
              <h1 className="text-4xl font-bold text-white">
                Flight Route Planner
              </h1>
              <p className="text-white/70 text-lg mt-1">
                Manage and create your flight routes
              </p>
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
              placeholder="Search routes..."
              className="pl-12 bg-slate-900/60 backdrop-blur-xl border-white/30 text-white placeholder:text-white/50 h-14 text-lg rounded-2xl"
            />
          </div>
          <Button
            onClick={createNewRoute}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-14 px-8 text-lg rounded-2xl shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Route
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
                <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 hover:bg-slate-800/70 hover:scale-105 transition-all duration-300 shadow-xl group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {route.name}
                      </h3>
                      <p className="text-white/60 text-sm">
                        Updated: {formatDate(route.updated)}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => deleteRoute(route.id, e)}
                      className="text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2 rounded-xl">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm">
                        {route.waypoints?.length || 0} waypoints
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-white/80">
                      <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-xl">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm">
                        {route.cruiseSpeed} {route.speedUnit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                    <Link
                      to={createPageUrl(`FlightTracking?routeId=${route.id}`)}
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm"
                        disabled={
                          !route.waypoints || route.waypoints.length === 0
                        }
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Start Flight
                      </Button>
                    </Link>
                    <Link
                      to={createPageUrl(`FlightPlanner?routeId=${route.id}`)}
                    >
                      <Button
                        variant="outline"
                        className="w-full bg-slate-800/60 border-white/30 text-white hover:bg-slate-700/60 text-sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Route
                      </Button>
                    </Link>
                  </div>
                </Card>
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
                {searchQuery ? "No routes found" : "No routes yet"}
              </h3>
              <p className="text-white/70 mb-6 max-w-md">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first flight route to get started"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={createNewRoute}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Route
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
