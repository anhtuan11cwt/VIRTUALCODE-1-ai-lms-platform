import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  loading: false,
};

const courseSlice = createSlice({
  initialState,
  name: "course",
  reducers: {
    addCourse: (state, action) => {
      state.courses.unshift(action.payload);
    },
    removeCourse: (state, action) => {
      state.courses = state.courses.filter((c) => c._id !== action.payload);
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateCourse: (state, action) => {
      const idx = state.courses.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) state.courses[idx] = action.payload;
    },
  },
});

export const { addCourse, removeCourse, setCourses, setLoading, updateCourse } =
  courseSlice.actions;
export default courseSlice.reducer;
