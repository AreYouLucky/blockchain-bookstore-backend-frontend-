import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";

export default function App() {
  const account = localStorage.getItem("walletAddress");

  return (
    <Routes>
      <Route
        path="/"
        element={account ? <Home /> : <Navigate to="/auth" />}
      />
      <Route
        path="/auth"
        element={account ? <Navigate to="/" /> : <Auth />}
      />
    </Routes>
  );
}
