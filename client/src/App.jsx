import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./dashboard/pages/Login";
import MainLayout from "./dashboard/layout/MainLayout";
import AdminIndex from "./dashboard/pages/AdminIndex";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route path="" element={<Navigate to="/dashboard/admin" />}>
            <Route path="admin" element={<AdminIndex />} />/
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
