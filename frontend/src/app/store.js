import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postSlice';
import moduleReducer from '../features/modules/moduleSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    modules: moduleReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
});

