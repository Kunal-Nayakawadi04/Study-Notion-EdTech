import { createSlice } from "@reduxjs/toolkit";

const getStoredToken = () => {
  try {
    const raw = localStorage.getItem("token");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch (error) {
    return localStorage.getItem("token") || null;
  }
};

const initialState = {
  signupData: null,
  loading: false,
  token: getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;