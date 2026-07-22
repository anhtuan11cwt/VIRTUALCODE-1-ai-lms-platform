import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    clearUser: (state) => {
      state.userData = null;
    },
    setUser: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
