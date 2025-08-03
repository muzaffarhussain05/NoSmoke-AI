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

// Create router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="detection" element={<LiveDetection />} />
      <Route path="history" element={<Home />} />
      <Route path="database" element={<Database />} />
      <Route path="admin" element={<AdminLogin />} />
      <Route path="about" element={<About />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
