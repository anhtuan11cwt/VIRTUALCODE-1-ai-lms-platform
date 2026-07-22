import { Route, Routes } from "react-router-dom";
import "./App.css";

import GuestRoute from "./components/GuestRoute";
import Nav from "./components/Navbar/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import useCurrentUser from "./hooks/useCurrentUser";
import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import CreateLecture from "./pages/CreateLecture";
import Dashboard from "./pages/Dashboard";
import EditCourse from "./pages/EditCourse";
import EditLecture from "./pages/EditLecture";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyEnrolledCourses from "./pages/MyEnrolledCourses";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ViewLectures from "./pages/ViewLectures";

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
        <Route
          element={
            <ProtectedRoute isChecking={isChecking}>
              <ViewLectures />
            </ProtectedRoute>
          }
          path="/course/:courseId/lectures"
        />
        <Route element={<CourseDetail />} path="/course/:id" />
        <Route
          element={
            <ProtectedRoute isChecking={isChecking} requiredRole="educator">
              <Dashboard />
            </ProtectedRoute>
          }
          path="/dashboard"
        />
        <Route
          element={
            <ProtectedRoute isChecking={isChecking} requiredRole="educator">
              <CreateCourse />
            </ProtectedRoute>
          }
          path="/dashboard/create-course"
        />
        <Route
          element={
            <ProtectedRoute isChecking={isChecking} requiredRole="educator">
              <EditCourse />
            </ProtectedRoute>
          }
          path="/dashboard/edit-course/:id"
        />
        <Route
          element={
            <ProtectedRoute isChecking={isChecking} requiredRole="educator">
              <CreateLecture />
            </ProtectedRoute>
          }
          path="/dashboard/edit-course/:id/lectures"
        />
        <Route
          element={
            <ProtectedRoute isChecking={isChecking} requiredRole="educator">
              <EditLecture />
            </ProtectedRoute>
          }
          path="/dashboard/edit-course/:courseId/lecture/:lectureId"
        />
        <Route
          element={
            <ProtectedRoute isChecking={isChecking}>
              <MyEnrolledCourses />
            </ProtectedRoute>
          }
          path="/my-courses"
        />
        <Route
          element={
            <ProtectedRoute isChecking={isChecking}>
              <Profile />
            </ProtectedRoute>
          }
          path="/profile"
        />
        <Route
          element={
            <ProtectedRoute isChecking={isChecking}>
              <EditProfile />
            </ProtectedRoute>
          }
          path="/edit-profile"
        />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </>
  );
}

export default App;
