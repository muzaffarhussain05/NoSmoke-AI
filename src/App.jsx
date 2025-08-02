import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Layout from "./pages/Layout";

// Create router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="detection" element={<Home />} />
      <Route path="history" element={<Home />} />
      <Route path="database" element={<Home />} />
      <Route path="admin" element={<Home />} />
      <Route path="about" element={<Home />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
