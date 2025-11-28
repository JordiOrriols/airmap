import { Locale } from "./types";

export const en: Locale = {
  translation: {
    // Home
    "home.title": "Flight Route Planner",
    "home.subtitle": "Manage and create your flight routes",
    "home.create": "Create New Route",
    "home.create_first": "Create First Route",
    "home.search_placeholder": "Search routes...",

    // Planner
    "planner.header.title": "Flight Route Planner",
    "planner.header.mode_edit": "Click to add waypoints",
    "planner.header.mode_move": "Drag to reposition",
    "planner.saved": "Saved",

    "planner.route_control.title": "Route Control",
    "planner.route_control.route_name": "Route Name",
    "planner.route_control.cruise_speed": "Cruise Speed",
    "planner.route_control.edit_mode_on": "Edit Mode: ON",
    "planner.route_control.move_mode_on": "Move Mode: ON",
    "planner.route_control.airspace_on": "Airspace: ON",
    "planner.route_control.airspace_off": "Airspace: OFF",
    "planner.route_control.export": "Export",
    "planner.route_control.import": "Import",
    "planner.route_control.clear": "Clear Route",

    "planner.route_info.title": "Route Information",
    "planner.import_error": "Error importing route. Please check the file format.",
    "route.imported_name": "Imported Route",
    "planner.route_info.waypoints": "{count} waypoints",

    // Route card
    "route.start_flight": "Start Flight",
    "route.edit_route": "Edit Route",
    "route.updated": "Updated: {{date}}",

    // Tracking
    "tracking.no_route.title": "No Route Selected",
    "tracking.no_route.desc": "Please select a route to start tracking",
    "tracking.go_to_routes": "Go to Routes",
    "tracking.start_tracking": "Start Tracking",
    "tracking.stop_tracking": "Stop Tracking",
    "tracking.geolocation_unsupported": "Geolocation is not supported by your browser",
    "tracking.unable_get_location": "Unable to get your location. Please check your permissions.",
    "tracking.status.in_progress": "Flight in progress",
    "tracking.status.ready": "Ready to start",
    "tracking.flight_complete.title": "Flight Complete!",
    "tracking.flight_complete.desc": "You've reached all waypoints",
    "tracking.finish_tracking": "Finish Tracking",

    // Next waypoint panel
    "next_waypoint.title": "Next Waypoint",
    "next_waypoint.progress": "Progress",
    "next_waypoint.waypoint_of": "Waypoint {{index}} of {{total}}",
    "next_waypoint.distance": "Distance",
    "next_waypoint.eta": "ETA",
    "next_waypoint.waypoints_status": "{{current}}/{{total}} waypoints",

    // Units
    "unit.nm": "NM",

    // Route stats
    "route_stats.total_distance": "Total Distance",
    "route_stats.nautical_miles": "nautical miles",
    "route_stats.flight_time": "Flight Time",
    "route_stats.at_speed": "at {{speed}} {{unit}}",

    // Route segments / stats
    "stat.heading": "Heading",
    "stat.distance": "Distance",
    "stat.time": "Time",

    // Weather
    "weather.no_data": "No weather data available",
    "weather.wind": "Wind",
    "weather.gusts": "Gusts",
    "weather.clouds": "Clouds",
    "weather.visibility": "Visibility",
    "weather.rain": "Rain",
    "weather.feels_like": "Feels Like",
    "weather.select_day": "Select Day",
    "weather.select_hour": "Select Hour",
    "weather.loading": "Loading weather...",
    "weather.loading_data": "Loading weather data...",
    "weather.check_api": "Check API key configuration",

    // Dates
    "date.today": "Today",
    "date.tomorrow": "Tomorrow",

    // Home additional
    "home.no_routes_found": "No routes found",
    "home.no_routes_yet": "No routes yet",
    "home.try_adjust_search": "Try adjusting your search query",
    "home.create_first_desc": "Create your first flight route to get started",

    // Generic
    "action.ok": "OK",
    "action.cancel": "Cancel",
    "label.progress": "Progress"
  },
};
