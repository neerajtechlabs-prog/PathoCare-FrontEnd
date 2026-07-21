import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, AuthUser, LoginPayload, LoginResponse, SignupPayload, SignupResponse } from './authService';

interface BootstrapState {
  checked: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  profileLoading: boolean;
  bootstrapComplete: boolean;
}

const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  loading: false,
  error: null,
  isAuthenticated: !!storedToken,
  profileLoading: false,
  bootstrapComplete: false,
};

export const login = createAsyncThunk<LoginResponse, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Please enter email and password');
      }

      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk<SignupResponse, SignupPayload, { rejectValue: string }>(
  'auth/signup',
  async (payload, { rejectWithValue }) => {
    try {
      if (!payload.name || !payload.email || !payload.password) {
        throw new Error('Please provide your name, email, and password');
      }

      return await authService.signup(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Signup failed');
    }
  }
);

export const fetchProfile = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Unable to load profile');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  await authService.logout();
  dispatch(clearAuth());
});

export const bootstrapAuth = createAsyncThunk<AuthUser | null, void, { rejectValue: string }>(
  'auth/bootstrapAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return null;
      }
      return await authService.getProfile();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Session validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.accessToken);
        // do not persist refresh token in localStorage; backend sets it in an httpOnly cookie
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Signup failed';
      })
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload ?? 'Unable to load profile';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.profileLoading = false;
      })
      .addCase(bootstrapAuth.pending, (state) => {
        state.bootstrapComplete = false;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.bootstrapComplete = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.token = localStorage.getItem('accessToken');
          localStorage.setItem('user', JSON.stringify(action.payload));
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('user');
        }
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.bootstrapComplete = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
        // ensure refresh cookie/session cleared by backend logout flow; remove any client-side access token
        localStorage.removeItem('user');
      });
  },
});

export const { clearAuth, setAuthUser } = authSlice.actions;
export default authSlice.reducer;
