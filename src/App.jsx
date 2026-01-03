import React, { Suspense } from "react";
import FlightPlanner from "./pages/planner";
import Home from "./pages/home";
import FlightTracker from "./pages/tracking";
import "./lib/i18n";
import { ErrorBoundary } from "react-error-boundary";
import { createHashRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "./lib/theme-context";

const router = createHashRouter([
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

export default function App() {
  const { t } = useTranslation();

  return (
    <ThemeProvider>
      <Suspense fallback={t("app.loading", "loading")}>
        <ErrorBoundary fallback={<div>{t("app.error", "Something went wrong")}</div>}>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  );
}
