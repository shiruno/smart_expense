// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import DashboardApp from "./pages/Dashboard/App";

export default function App() {
  const isLoggedIn = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignIn />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/*" element={<DashboardApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
