import api from "./api";

export const signupUser = (data) => api.post("/auth/signup", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const logoutUser = () => api.post("/auth/logout");

export const getCurrentUser = () => api.get("/auth/current-user");
