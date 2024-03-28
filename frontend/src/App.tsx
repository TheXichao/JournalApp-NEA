import "./App.css";
import NavBar from "./components/layout/NavBar";
import { Route, Routes } from "react-router-dom";
import useUserContext from "./hooks/useUserContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import JournalEntriesPage from "./pages/entry/JournalEntriesPage";
import CreateEntryPage from "./pages/entry/CreateEntryPage";
import StatisticsPage from "./pages/statistics/StatisticsPage";

import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const { user } = useUserContext();

  // Check if the user is logged in
  const cookies = new Cookies();

  return (
    <div className="App">
      <div className="routes">
        <NavBar isAuthenticated={!user ? false : true} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/entries" element={<JournalEntriesPage />} />
          <Route path="/create-entry" element={<CreateEntryPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />

          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <RedirectToLogin />}
          />
        </Routes>
      </div>
    </div>
  );
}

// Redirect to login page if user is not logged in
function RedirectToLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 2000); // Redirect after 2 seconds
  }, [navigate]);

  return <div>You are not logged in. Redirecting to login page...</div>;
}

export default App;
