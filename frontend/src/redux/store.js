import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./courseSlice";
import lectureReducer from "./lectureSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    course: courseReducer,
    lecture: lectureReducer,
    user: userReducer,
  },
});
