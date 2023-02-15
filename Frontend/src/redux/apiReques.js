import {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerSuccess,
  registerFailed,
} from "./authSlice";
import { getUserStarts, getUserSuccess, getUserFailed } from "./userSlice";
// import axios from "axios";
import axios from "axios";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("/api/auth/login", user);
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post("/api/auth/register", user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (error) {
    dispatch(registerFailed());
  }
};

export const getAllUsers = async (accessToken, dispatch) => {
  dispatch(getUserStarts());
  try {
    const res = await axios.get("/api/users/", {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getUserSuccess(res.data));
  } catch (error) {
    dispatch(getUserFailed());
  }
};
