import { Route, Routes } from "react-router-dom";
import "./App.css";

import GuestRoute from "./components/GuestRoute";
import Nav from "./components/Navbar/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import useCurrentUser from "./hooks/useCurrentUser";
import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
  const isChecking = useCurrentUser();

  return (
    <>
      <Nav isChecking={isChecking} />
      <Routes>
        <Route element={<Home />} path="/" />
        <Route
          element={
            <GuestRoute isChecking={isChecking}>
              <Login />
            </GuestRoute>
          }
          path="/login"
        />
        <Route
          element={
            <GuestRoute isChecking={isChecking}>
              <Register />
            </GuestRoute>
          }
          path="/register"
        />
        <Route
          element={
            <GuestRoute isChecking={isChecking}>
              <ForgotPassword />
            </GuestRoute>
          }
          path="/forgot-password"
        />
        <Route element={<Courses />} path="/courses" />
        <Route element={<CourseDetail />} path="/course/:id" />
        <Route
          element={
            <ProtectedRoute requiredRole="educator">
              <Dashboard />
            </ProtectedRoute>
          }
          path="/dashboard/*"
        />
        <Route
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          path="/profile"
        />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </>
  );
}

export default App;
