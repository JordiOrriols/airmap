import React, { Suspense } from "react";
import Home from "./pages/Home";
import "./lib/i18n";
import { ErrorBoundary } from "react-error-boundary";

export default () => (
  <Suspense fallback="loading">
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Home />
    </ErrorBoundary>
  </Suspense>
);
