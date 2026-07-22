import { Route, Routes } from "react-router-dom";
import "./App.css";

import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<Courses />} path="/courses" />
      <Route element={<CourseDetail />} path="/course/:id" />
      <Route element={<Dashboard />} path="/dashboard/*" />
      <Route element={<Profile />} path="/profile" />
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}

export default App;
