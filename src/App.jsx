// src/App.jsx
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext"; // <-- fixed import

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import RewardsPage from "./pages/RewardsPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import AdminPage from "./pages/AdminPage";

import Navbar from "./components/Layout/Navbar";
import { onPageChange, getCurrentPage } from "./pages/navigation";

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(getCurrentPage());

  useEffect(() => {
    const unsubscribe = onPageChange(setCurrentPage);
    return unsubscribe;
  }, []);

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="container mx-auto px-4 py-8">
        {currentPage === "home" && <HomePage />}
        {currentPage === "events" && <EventsPage />}
        {currentPage === "rewards" && <RewardsPage />}
        {currentPage === "profile" && <ProfilePage />}
        {currentPage === "create-post" && <CreatePostPage />}
        {currentPage === "admin" && <AdminPage />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
