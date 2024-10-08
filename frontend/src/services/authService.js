import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Replace with your backend URL

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/user/signin`, {
    email,
    password,
  });
  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/user/signup`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/user/logout`);
};
