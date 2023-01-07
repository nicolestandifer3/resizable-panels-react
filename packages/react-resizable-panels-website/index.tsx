import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomeRoute from "./src/routes/Home";
import ConditionalExampleRoute from "./src/routes/examples/Conditional";
import ExternalPersistenceExampleRoute from "./src/routes/examples/ExternalPersistence";
import HorizontalExampleRoute from "./src/routes/examples/Horizontal";
import ImperativeApiExampleRoute from "./src/routes/examples/ImperativeApi";
import NestedExampleRoute from "./src/routes/examples/Nested";
import OverflowExampleRoute from "./src/routes/examples/Overflow";
import PersistenceExampleRoute from "./src/routes/examples/Persistence";
import CollapsibleExampleRoute from "./src/routes/examples/Collapsible";
import VerticalExampleRoute from "./src/routes/examples/Vertical";
import EndToEndTestingRoute from "./src/routes/EndToEndTesting";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
  },
  {
    path: "/examples/conditional",
    element: <ConditionalExampleRoute />,
  },
  {
    path: "/examples/external-persistence",
    element: <ExternalPersistenceExampleRoute />,
  },
  {
    path: "/examples/horizontal",
    element: <HorizontalExampleRoute />,
  },
  {
    path: "/examples/imperative-api",
    element: <ImperativeApiExampleRoute />,
  },
  {
    path: "/examples/nested",
    element: <NestedExampleRoute />,
  },
  {
    path: "/examples/overflow",
    element: <OverflowExampleRoute />,
  },
  {
    path: "/examples/persistence",
    element: <PersistenceExampleRoute />,
  },
  {
    path: "/examples/collapsible",
    element: <CollapsibleExampleRoute />,
  },
  {
    path: "/examples/vertical",
    element: <VerticalExampleRoute />,
  },

  // Special route used by e2e tests
  {
    path: "/__e2e",
    element: <EndToEndTestingRoute />,
  },
]);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
