import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../../config/firebase';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  favorites: string[];
}

interface AuthState {
  user: User | null;
  error: string | null;
}

// Get initial user from localStorage if exists
const storedUser = localStorage.getItem('user');
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  error: null,
};

if (initialState.user) {
  initialState.user.favorites = initialState.user.favorites || [];
}

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      favorites: []
    };
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      favorites: []
    };
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ displayName }: { displayName: string }) => {
    if (!auth.currentUser) throw new Error('No user is signed in');
    await updateProfile(auth.currentUser, { displayName });
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName,
      favorites: []
    };
  }
);

export const logOut = createAsyncThunk(
  'auth/logOut',
  async () => {
    await signOut(auth);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<FirebaseUser | null>) => {
      if (action.payload) {
        const storedFavorites = JSON.parse(localStorage.getItem('user') || '{}').favorites || [];
        const user = {
          uid: action.payload.uid,
          email: action.payload.email,
          displayName: action.payload.displayName,
          favorites: storedFavorites
        };
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        state.user = null;
        localStorage.removeItem('user');
      }
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.favorites = state.user.favorites || [];
        const productId = action.payload;
        const index = state.user.favorites.indexOf(productId);
        if (index === -1) {
          // Add to favorites
          state.user.favorites.push(productId);
        } else {
          // Remove from favorites
          state.user.favorites.splice(index, 1);
        }
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to sign up';
      })
      .addCase(signIn.pending, (state) => {
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to sign in';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update profile';
      })
      .addCase(logOut.pending, (state) => {
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to log out';
      });
  },
});

export const { setUser } = authSlice.actions;
export const { addToFavorites } = authSlice.actions;
export default authSlice.reducer;
