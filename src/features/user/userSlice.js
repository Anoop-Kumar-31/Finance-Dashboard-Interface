import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  allUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, setAllUsers, logout } = userSlice.actions;

export default userSlice.reducer;
