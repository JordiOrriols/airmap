import React from "react";
import type { RefObject } from "react";
import CollapsiblePanel from "../molecules/collapsible-panel";
import {
  Navigation,
  Trash2,
  Download,
  Upload,
  Edit3,
  MousePointer,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import WaypointListPanel from "./waypoints-list-panel";
import { useTranslation } from "react-i18next";
import type { SpeedUnit, Waypoint } from "../../types";

type Props = {
  routeName: string;
  setRouteName: (v: string) => void;
  cruiseSpeed: number;
  setCruiseSpeed: (v: number) => void;
  speedUnit: SpeedUnit;
  setSpeedUnit: (v: SpeedUnit) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  showAirspace: boolean;
  setShowAirspace: (v: boolean) => void;
  exportRoute: () => void;
  importRoute: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearRoute: () => void;
  waypoints: Waypoint[];
  removeWaypoint: (index: number) => void;
  reorderWaypoints: (start: number, end: number) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  reloadAirspace?: () => void;
};

export default function RouteControlPanel({
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
  exportRoute,
  importRoute,
  clearRoute,
  waypoints,
  removeWaypoint,
  reorderWaypoints,
  fileInputRef,
  reloadAirspace,
}: Props) {
  const { t } = useTranslation();
  return (
    <CollapsiblePanel
      title={t("planner.route_control.title", "Route Control")}
      icon={Navigation}
      gradient="from-cyan-500 to-blue-500"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-app-primary mb-2 block">
            {t("planner.route_control.route_name", "Route Name")}
          </label>
          <Input
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder={t("planner.route_control.route_name_placeholder", "Enter route name...")}
            className="bg-input-app border-input-app text-input-app placeholder:text-app-muted backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-header mb-2 block">
            {t("planner.route_control.cruise_speed", "Cruise Speed")}
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={cruiseSpeed}
              onChange={(e) => setCruiseSpeed(Number(e.target.value))}
              className="bg-input-app border-input-app text-input-app placeholder:text-app-muted backdrop-blur-sm flex-1"
            />
            <Select value={speedUnit} onValueChange={(v) => setSpeedUnit(v as SpeedUnit)}>
              <SelectTrigger className="w-24 bg-input-app border-input-app text-input-app backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="knots">{t("unit.knots", "Knots")}</SelectItem>
                <SelectItem value="kmh">{t("unit.kmh", "Km/h")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            onClick={toggleEditMode}
            className={`w-full backdrop-blur-sm transition-all duration-300 border ${
              isEditMode
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-emerald-400/30"
                : "bg-input-app border-app-secondary text-input-app hover:bg-button-ghost"
            }`}
          >
            {isEditMode ? (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                {t("planner.route_control.edit_mode_on", "Edit Mode: ON")}
              </>
            ) : (
              <>
                <MousePointer className="w-4 h-4 mr-2" />
                {t("planner.route_control.move_mode_on", "Move Mode: ON")}
              </>
            )}
          </Button>

          <Button
            onClick={() => setShowAirspace(!showAirspace)}
            variant="outline"
            className={`w-full backdrop-blur-sm transition-all duration-300 ${
              showAirspace
                ? "bg-blue-500/30 border-blue-400/40 text-white"
                : "bg-input-app border-app-secondary text-input-app hover:bg-button-ghost"
            }`}
          >
            {showAirspace ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                {t("planner.route_control.airspace_on", "Airspace: ON")}
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                {t("planner.route_control.airspace_off", "Airspace: OFF")}
              </>
            )}
          </Button>

          {showAirspace && (
            <Button
              onClick={reloadAirspace}
              variant="outline"
              className="w-full backdrop-blur-sm bg-input-app border-app-secondary text-input-app hover:bg-button-ghost transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("planner.route_control.reload_airspace", "Reload")}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={exportRoute}
            variant="outline"
            className="bg-input-app border-app-secondary text-input-app hover:bg-blue-500/30 hover:border-blue-400/40 backdrop-blur-sm transition-all"
            disabled={waypoints.length === 0}
          >
            <Download className="w-4 h-4 mr-1" />
            {t("planner.route_control.export", "Export")}
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="bg-input-app border-app-secondary text-input-app hover:bg-purple-500/30 hover:border-purple-400/40 backdrop-blur-sm transition-all"
          >
            <Upload className="w-4 h-4 mr-1" />
            {t("planner.route_control.import", "Import")}
          </Button>
        </div>

        <Button
          onClick={clearRoute}
          variant="outline"
          className="w-full bg-input-app border-app-secondary text-input-app hover:bg-red-500/30 hover:border-red-400/40 backdrop-blur-sm transition-all"
          disabled={waypoints.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t("planner.route_control.clear", "Clear Route")}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importRoute}
          style={{ display: "none" }}
        />

        <WaypointListPanel
          waypoints={waypoints}
          onRemove={removeWaypoint}
          onReorder={reorderWaypoints}
        />
      </div>
    </CollapsiblePanel>
  );
}
