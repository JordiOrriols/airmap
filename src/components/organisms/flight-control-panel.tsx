import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Navigation,
  Trash2,
  Edit3,
  MousePointer,
  Download,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import GradientIcon from "../atoms/gradient-icon";
import GlassCard from "../atoms/glass-card";

export default function FlightControlPanel({
  routeName,
  setRouteName,
  cruiseSpeed,
  setCruiseSpeed,
  speedUnit,
  setSpeedUnit,
  isEditMode,
  toggleEditMode,
  showAirspace,
  setShowAirspace,
  onExport,
  onImport,
  onClear,
  hasWaypoints,
  fileInputRef,
  children,
}) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <GradientIcon icon={Navigation} gradient="from-cyan-500 to-blue-500" />
        <h2 className="text-xl font-bold text-white">Route Control</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white/90 mb-2 block">
            Route Name
          </label>
          <Input
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Enter route name..."
            className="bg-slate-800/60 border-white/30 text-white placeholder:text-white/50 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white/90 mb-2 block">
            Cruise Speed
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={cruiseSpeed}
              onChange={(e) => setCruiseSpeed(Number(e.target.value))}
              className="bg-slate-800/60 border-white/30 text-white placeholder:text-white/40 backdrop-blur-sm flex-1"
            />
            <Select value={speedUnit} onValueChange={setSpeedUnit}>
              <SelectTrigger className="w-24 bg-slate-800/60 border-white/30 text-white backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="knots">Knots</SelectItem>
                <SelectItem value="kmh">Km/h</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            onClick={toggleEditMode}
            className={`w-full backdrop-blur-sm transition-all duration-300 ${
              isEditMode
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-emerald-400/30"
                : "bg-slate-800/60 border-white/30 text-white hover:bg-slate-700/60"
            } border`}
          >
            {isEditMode ? (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Mode: ON
              </>
            ) : (
              <>
                <MousePointer className="w-4 h-4 mr-2" />
                Move Mode: ON
              </>
            )}
          </Button>

          <Button
            onClick={() => setShowAirspace(!showAirspace)}
            variant="outline"
            className={`w-full backdrop-blur-sm transition-all duration-300 ${
              showAirspace
                ? "bg-blue-500/30 border-blue-400/40 text-white"
                : "bg-slate-800/60 border-white/30 text-white hover:bg-slate-700/60"
            }`}
          >
            {showAirspace ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Airspace: ON
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Airspace: OFF
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onExport}
              variant="outline"
              className="bg-slate-800/60 border-white/30 text-white hover:bg-blue-500/30 hover:border-blue-400/40 backdrop-blur-sm transition-all"
              disabled={!hasWaypoints}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="bg-slate-800/60 border-white/30 text-white hover:bg-purple-500/30 hover:border-purple-400/40 backdrop-blur-sm transition-all"
            >
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
          </div>

          <Button
            onClick={onClear}
            variant="outline"
            className="w-full bg-slate-800/60 border-white/30 text-white hover:bg-red-500/30 hover:border-red-400/40 backdrop-blur-sm transition-all"
            disabled={!hasWaypoints}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Route
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={onImport}
          style={{ display: "none" }}
        />
      </div>

      {children}
    </GlassCard>
  );
}
