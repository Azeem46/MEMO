import {jwtDecode} from 'jwt-decode';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token } = action.payload;
            state.token = token;
            state.user = jwtDecode(token); // Decode token to get user info
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
