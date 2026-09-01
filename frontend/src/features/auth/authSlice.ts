import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'borrower' | 'owner' | 'admin';
  token?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

// Get user from localStorage
const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

const initialState: AuthState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const login = createAsyncThunk(
  'auth/login',
  async (userData: Record<string, unknown>, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        String(err);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: Record<string, unknown>, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        String(err);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
