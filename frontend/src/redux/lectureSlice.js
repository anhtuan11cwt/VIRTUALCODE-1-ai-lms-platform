import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lectureData: [],
};

const lectureSlice = createSlice({
  initialState,
  name: "lecture",
  reducers: {
    setLectureData: (state, action) => {
      state.lectureData = action.payload;
    },
  },
});

export const { setLectureData } = lectureSlice.actions;
export default lectureSlice.reducer;
