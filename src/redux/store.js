import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import forgotPaswordReducer from "./forgotPassword/forgotPassword";

// Combine all reducers
const roorReducer = combineReducers({
  // Add reducers here
  user: userReducer,
  forgotPasword: forgotPaswordReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, roorReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
