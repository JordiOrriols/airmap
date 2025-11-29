import { Locale } from "./types";

export const es: Locale = {
  translation: {
    // Home
    "home.title": "Planificador de rutas de vuelo",
    "home.subtitle": "Gestiona y crea tus rutas de vuelo",
    "home.create": "Crear nueva ruta",
    "home.create_first": "Crear la primera ruta",
    "home.search_placeholder": "Buscar rutas...",

    // Planner
    "planner.header.title": "Planificador de rutas de vuelo",
    "planner.header.mode_edit": "Haz clic para añadir puntos de ruta",
    "planner.header.mode_move": "Arrastra para reposicionar",
    "planner.saved": "Guardado",

    "planner.route_control.title": "Control de ruta",
    "planner.route_control.route_name": "Nombre de la ruta",
    "planner.route_control.route_name_placeholder":
      "Introduce el nombre de la ruta...",
    "planner.route_control.cruise_speed": "Velocidad de crucero",
    "planner.route_control.edit_mode_on": "Modo edición: ON",
    "planner.route_control.move_mode_on": "Modo mover: ON",
    "planner.route_control.airspace_on": "Espacio aéreo: ON",
    "planner.route_control.airspace_off": "Espacio aéreo: OFF",
    "planner.route_control.reload_airspace": "Recargar",
    "planner.route_control.export": "Exportar",
    "planner.route_control.import": "Importar",
    "planner.route_control.clear": "Borrar ruta",

    "planner.route_info.title": "Información de la ruta",
    "planner.import_error":
      "Error al importar la ruta. Revisa el formato del archivo.",
    "route.imported_name": "Ruta importada",
    "planner.route_info.waypoints": "{count} puntos de ruta",

    // Route card
    "route.start_flight": "Iniciar vuelo",
    "route.edit_route": "Editar ruta",
    "route.updated": "Actualizado: {{date}}",

    // Tracking
    "tracking.no_route.title": "Ninguna ruta seleccionada",
    "tracking.no_route.desc": "Selecciona una ruta para empezar el seguimiento",
    "tracking.go_to_routes": "Ir a rutas",
    "tracking.start_tracking": "Iniciar seguimiento",
    "tracking.stop_tracking": "Detener seguimiento",
    "tracking.geolocation_unsupported":
      "La geolocalización no es compatible con tu navegador",
    "tracking.unable_get_location":
      "No se puede obtener tu ubicación. Revisa los permisos.",
    "tracking.status.in_progress": "Vuelo en curso",
    "tracking.status.ready": "Listo para empezar",
    "tracking.flight_complete.title": "¡Vuelo completado!",
    "tracking.flight_complete.desc": "Has alcanzado todos los puntos de ruta",
    "tracking.finish_tracking": "Finalizar seguimiento",

    // Next waypoint panel
    "next_waypoint.title": "Siguiente punto",
    "next_waypoint.progress": "Progreso",
    "next_waypoint.waypoint_of": "Punto {{index}} de {{total}}",
    "next_waypoint.distance": "Distancia",
    "next_waypoint.eta": "ETA",
    "next_waypoint.waypoints_status": "{{current}}/{{total}} puntos",

    // Units
    "unit.nm": "MN",
    "unit.knots": "Nudos",
    "unit.kmh": "Km/h",

    // Route stats
    "route_stats.total_distance": "Distancia total",
    "route_stats.nautical_miles": "millas náuticas",
    "route_stats.flight_time": "Tiempo de vuelo",
    "route_stats.at_speed": "a {{speed}} {{unit}}",

    // Route segments / stats
    "stat.heading": "Rumbo",
    "stat.distance": "Distancia",
    "stat.time": "Tiempo",
    "stat.speed": "Velocidad",
    "stat.ground_speed": "Velocidad suelo",

    // Waypoints
    "waypoints.title": "Puntos de ruta",

    // Airspace
    "airspace.loading": "Cargando espacios aéreos...",
    "airspace.class": "Clase",
    "airspace.lower_limit": "Límite inferior",
    "airspace.upper_limit": "Límite superior",
    "airspace.country": "País",
    "airspace.na": "N/A",

    // Errors
    "error.something_wrong": "Algo salió mal",

    // Weather
    "weather.no_data": "No hay datos meteorológicos disponibles",
    "weather.wind": "Viento",
    "weather.gusts": "Ráfagas",
    "weather.clouds": "Nubes",
    "weather.visibility": "Visibilidad",
    "weather.rain": "Lluvia",
    "weather.feels_like": "Sensación térmica",
    "weather.select_day": "Seleccionar día",
    "weather.select_hour": "Seleccionar hora",
    "weather.loading": "Cargando meteorología...",
    "weather.loading_data": "Cargando datos meteorológicos...",
    "weather.check_api": "Revisa la configuración de la clave de la API",

    // Dates
    "date.today": "Hoy",
    "date.tomorrow": "Mañana",

    // Home additional
    "home.no_routes_found": "No se encontraron rutas",
    "home.no_routes_yet": "Aún no hay rutas",
    "home.try_adjust_search": "Prueba ajustando tu búsqueda",
    "home.create_first_desc": "Crea tu primera ruta de vuelo para comenzar",

    // Generic
    "action.ok": "OK",
    "action.cancel": "Cancelar",
    "label.progress": "Progreso",
  },
};
