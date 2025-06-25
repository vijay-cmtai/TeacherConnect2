// file: src/features/auth/authSlice.js

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Shuru me localStorage se user data load karne ki koshish karein
const userFromStorage = localStorage.getItem("user");
const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  // Shuruaat me authentication state token par depend karegi
  // Agar token hai to user authenticated maan sakte hain jab tak verify na ho
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Jab user login kare, to state aur localStorage dono me save karein
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // User object ko string me convert karke localStorage me save karein
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      // Token ko bhi localStorage me save karein
      localStorage.setItem("token", action.payload.token);
    },
    // Jab user logout kare, to state aur localStorage dono se sab kuch hatayein
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // localStorage se user ki details हटा dein
      localStorage.removeItem("user");
      // >>> YAHI SABSE ZAROORI BADLAV HAI <<<
      // localStorage se token bhi हटा dein!
      // (Aapke token ka naam 'jwt', 'authToken', etc. bhi ho sakta hai)
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;