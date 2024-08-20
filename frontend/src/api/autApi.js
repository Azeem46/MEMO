import axios from 'axios';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';

const API_URL =  'http://localhost:5000'; // Update with your backend URL

const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/user/signin`, userData);
  return response.data;
};

const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/user/signup`, userData);
  return response.data;
};

export const useLoginMutation = () => {
  const dispatch = useDispatch();

  return useMutation(loginUser, {
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
  });
};

export const useRegisterMutation = () => {
  const dispatch = useDispatch();

  return useMutation(registerUser, {
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
  });
};
