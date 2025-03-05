import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import SignUp from "./pages/Signup";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TestPage from "./pages/Testpage";
import Chatbot from "./components/Chatbot";
import ChatbotInstructor from "./components/ChatbotInstructor";
import Test from "./components/Test";
import './App.css';
import UserProfile from "./pages/UserProfile";
import { useAuth } from "./context/AuthContext"; 
import NotFound from "./pages/NotFound";
import OrgDashboard from "./pages/OrgDashboard";
import OrgTestPage from "./pages/OrgTestPage";
import OrgTestAttempts from "./pages/ORGTestAttempts";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  if (user === undefined) return <p>Loading...</p>; // ✅ Show loading state while checking

  if (!user) {
    // Save current path before redirecting
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return element;
};

const App = () => { 
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <Router>
      <MainRoutes />
    </Router>
  );
};

const MainRoutes = () => {
  const { user } = useAuth();

  const location = useLocation(); // Get the current route

  // Define routes where the chatbot should be displayed
  const showChatbot = ["/dashboard", "/testpage"].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={user?.role === "org" ? <OrgDashboard /> : <Dashboard />} />}
        />
        <Route path="/testpage" element={<TestPage />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/instructor" element={<ChatbotInstructor />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test/:id" element={<OrgTestPage />} />
        <Route path="/test/:testId/attempts" element={<OrgTestAttempts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Only show chatbot on dashboard and testpage */}
      {showChatbot && <Chatbot />}


    </>
  );
};

export default App;
