import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Layout from "./pages/Layout";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import LiveDetection from "./pages/LiveDetection";
import Database from "./pages/Database";
import History from "./pages/History";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
// Create router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="admin" element={<AdminLogin />} />
      <Route path="about" element={<About />} />

      <Route path="detection"  element={
          <ProtectedRoute>
            <LiveDetection />
          </ProtectedRoute>
        } />
      <Route
        path="history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="database"
        element={
          <ProtectedRoute>
            <Database />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
