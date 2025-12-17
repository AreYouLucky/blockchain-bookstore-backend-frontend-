import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import BookSaleList from "./pages/sale/BookSaleList";
import OwnedBooks from "./pages/owned/OwnedBooks";
import About from "./pages/about/About";

export default function App() {
  const account = localStorage.getItem("walletAddress");

  return (
    <Routes>
      <Route
        path="/"
        element={account ? <BookSaleList /> : <Navigate to="/auth" />}
      />
      <Route
        path="/auth"
        element={account ? <Navigate to="/" /> : <Auth />}
      />
      <Route
        path="/owned-books"
        element={account ? <OwnedBooks /> : <Navigate to="/auth" />}
      />
      <Route
        path="/about"
        element={account ? <About /> : <Navigate to="/auth" />}
      />
    </Routes>
  );
}
