import api from "./api";

export const signupUser = (data) => api.post("/auth/signup", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const logoutUser = () => api.post("/auth/logout");

export const getCurrentUser = () => api.get("/auth/current-user");

export const sendOTP = (email) => api.post("/auth/send-otp", { email });

export const verifyOTP = (email, otp) =>
  api.post("/auth/verify-otp", { email, otp });

export const resetPassword = (email, password) =>
  api.post("/auth/reset-password", { email, password });
