import { createStore, applyMiddleware } from "redux";
import { rootReducer } from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER, } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {configureStore} from '@reduxjs/toolkit';

const initialState = {
  userData: {
    jwt: '',
    userId: '',
    isAuthenticated: false,
    email: '',
    language: 'en',
  }
}

const persistConfig = {
    key: 'root',
    storage,
  }

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    preloadedState: initialState,
})

export const persistor = persistStore(store);
