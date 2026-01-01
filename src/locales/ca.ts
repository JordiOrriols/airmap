import { Locale } from "./types";

export const ca: Locale = {
  translation: {
    // Home
    "home.title": "Planificador de rutes de vol",
    "home.subtitle": "Gestiona i crea les teves rutes de vol",
    "home.create": "Crear nova ruta",
    "home.create_first": "Crear la primera ruta",

    // Planner
    "planner.header.title": "Planificador de rutes de vol",
    "planner.header.mode_edit": "Fes clic per afegir punts de ruta",
    "planner.header.mode_move": "Arrossega per reposicionar",
    "planner.saved": "Guardat",

    "planner.route_control.title": "Control de ruta",
    "planner.route_control.route_name": "Nom de la ruta",
    "planner.route_control.route_name_placeholder": "Introdueix el nom de la ruta...",
    "planner.route_control.cruise_speed": "Velocitat de creuer",
    "planner.route_control.edit_mode_on": "Mode edició: ON",
    "planner.route_control.move_mode_on": "Mode moure: ON",
    "planner.route_control.airspace_on": "Espai aeri: ON",
    "planner.route_control.airspace_off": "Espai aeri: OFF",
    "planner.route_control.reload_airspace": "Recarregar",
    "planner.route_control.export": "Exportar",
    "planner.route_control.import": "Importar",
    "planner.route_control.clear": "Netejar ruta",

    "planner.route_info.title": "Informació de la ruta",
    "planner.import_error": "Error en importar la ruta. Revisa el format del fitxer.",
    "route.imported_name": "Ruta importada",

    // Route card
    "route.start_flight": "Iniciar vol",
    "route.edit_route": "Editar ruta",

    // Tracking
    "tracking.no_route.title": "Cap ruta seleccionada",
    "tracking.no_route.desc": "Selecciona una ruta per començar el seguiment",
    "tracking.go_to_routes": "Anar a rutes",
    "tracking.start_tracking": "Iniciar seguiment",
    "tracking.stop_tracking": "Aturar seguiment",
    "tracking.geolocation_unsupported": "La geolocalització no és compatible amb el teu navegador",
    "tracking.unable_get_location": "No s'ha pogut obtenir la teva ubicació. Revisa els permisos.",
    "tracking.status.in_progress": "Vol en curs",
    "tracking.status.ready": "Preparat per començar",
    "tracking.flight_complete.title": "Vol completat!",
    "tracking.flight_complete.desc": "Has arribat a tots els punts de ruta",
    "tracking.finish_tracking": "Finalitzar seguiment",

    // Next waypoint panel
    "next_waypoint.title": "Següent punt",
    "next_waypoint.progress": "Progrés",
    "next_waypoint.waypoint_of": "Punt {{index}} de {{total}}",
    "next_waypoint.distance": "Distància",
    "next_waypoint.eta": "ETA",
    "next_waypoint.waypoints_status": "{{current}}/{{total}} punts",

    // Units
    "unit.nm": "MN",
    "unit.knots": " Nusos",
    "unit.kmh": "Km/h",

    // Route stats
    "route_stats.total_distance": "Distància total",
    "route_stats.nautical_miles": "milles nàutiques",
    "route_stats.flight_time": "Temps de vol",
    "route_stats.at_speed": "a {{speed}} {{unit}}",

    // Route segments / stats
    "stat.heading": "Rumb",
    "stat.distance": "Distància",
    "stat.time": "Temps",
    "stat.speed": "Velocitat",
    "stat.ground_speed": "Velocitat terra",

    // Waypoints
    "waypoints.title": "Punts de ruta",

    // Airspace
    "airspace.loading": "Carregant espais aeris...",
    "airspace.class": "Classe",
    "airspace.lower_limit": "Límit inferior",
    "airspace.upper_limit": "Límit superior",
    "airspace.country": "País",
    "airspace.na": "N/A",

    // Errors
    "error.something_wrong": "Alguna cosa ha anat malament",

    // Weather
    "weather.no_data": "No hi ha dades meteorològiques disponibles",
    "weather.wind": "Vent",
    "weather.gusts": "Ratxes",
    "weather.clouds": "Núvols",
    "weather.visibility": "Visibilitat",
    "weather.rain": "Pluja",
    "weather.feels_like": "Sensació tèrmica",
    "weather.select_day": "Selecciona dia",
    "weather.select_hour": "Selecciona hora",
    "weather.loading": "Carregant meteorologia...",
    "weather.loading_data": "Carregant dades meteorològiques...",
    "weather.check_api": "Revisa la configuració de la clau API",

    // Dates
    "date.today": "Avui",
    "date.tomorrow": "Demà",

    // Home additional
    "home.no_routes_yet": "Encara no hi ha rutes",
    "home.create_first_desc": "Crea la teva primera ruta de vol per començar",

    // Generic
    "action.ok": "OK",
    "action.cancel": "Cancel·lar",
    "label.progress": "Progrés",
  },
};
