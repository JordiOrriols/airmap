const STORAGE_KEY = "flight_routes";

export const routeStorage = {
  getAllRoutes: () => {
    try {
      const savedRoutes = localStorage.getItem(STORAGE_KEY);
      return savedRoutes ? JSON.parse(savedRoutes) : [];
    } catch (error) {
      console.error("Error loading routes:", error);
      return [];
    }
  },

  getRoute: (routeId) => {
    const routes = routeStorage.getAllRoutes();
    return routes.find(r => r.id === routeId);
  },

  saveRoute: (routeData) => {
    try {
      const routes = routeStorage.getAllRoutes();
      const routeIndex = routes.findIndex(r => r.id === routeData.id);
      
      const routeToSave = {
        ...routeData,
        updated: new Date().toISOString()
      };

      if (routeIndex >= 0) {
        routes[routeIndex] = routeToSave;
      } else {
        routeToSave.created = routeToSave.created || new Date().toISOString();
        routes.push(routeToSave);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
      return true;
    } catch (error) {
      console.error("Error saving route:", error);
      return false;
    }
  },

  deleteRoute: (routeId) => {
    try {
      const routes = routeStorage.getAllRoutes();
      const updatedRoutes = routes.filter(r => r.id !== routeId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutes));
      return true;
    } catch (error) {
      console.error("Error deleting route:", error);
      return false;
    }
  },

  createNewRoute: () => {
    const newRoute = {
      id: `route_${Date.now()}`,
      name: "New Route",
      waypoints: [],
      cruiseSpeed: 120,
      speedUnit: "knots",
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    routeStorage.saveRoute(newRoute);
    return newRoute;
  }
};