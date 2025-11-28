import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Clock, Trash2, Navigation, Edit } from "lucide-react";
import { Link } from "react-router-dom";

export default function RouteCard({ route, index, onDelete, startHref, editHref }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 hover:bg-slate-800/70 hover:scale-105 transition-all duration-300 shadow-xl group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
            {route.name}
          </h3>
          <p className="text-white/60 text-sm">Updated: {formatDate(route.updated)}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => onDelete(route.id, e)}
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
          <span className="text-sm">{route.waypoints?.length || 0} waypoints</span>
        </div>

        <div className="flex items-center gap-3 text-white/80">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-xl">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm">{route.cruiseSpeed} {route.speedUnit}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
        <Link to={startHref}>
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm"
            disabled={!route.waypoints || route.waypoints.length === 0}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Start Flight
          </Button>
        </Link>
        <Link to={editHref}>
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
  );
}
