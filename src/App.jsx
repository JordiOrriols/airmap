import React, { Suspense } from "react";
import FlightPlanner from "./pages/planner";
import Home from "./pages/home";
import FlightTracker from "./pages/tracking";
import "./lib/i18n";
import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/tracker",
    element: <FlightTracker />,
  },
  {
    path: "/planner",
    element: <FlightPlanner />,
  },
]);

export default () => (
  <Suspense fallback="loading">
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <RouterProvider router={router} />,
    </ErrorBoundary>
  </Suspense>
);
