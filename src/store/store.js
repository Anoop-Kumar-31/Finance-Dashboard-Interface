import { configureStore, combineReducers } from "@reduxjs/toolkit";
import transactionReducer from "../features/transactions/transactionSlice";
import userReducer from "../features/user/userSlice";
import filterReducer from "../features/filters/filterSlice";

const STORAGE_KEY = "zorvyn-store";

// Grabs any saved data from the browser to pick up where we left off
const loadState = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
};

// Keeps our data persistent—we only save the essentials (like your txns and user info)
const saveState = (state) => {
  try {
    const toPersist = {
      transactions: state.transactions,
      user: state.user,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  } catch {
    // Just in case storage is full or disabled
  }
};

const rootReducer = combineReducers({
  transactions: transactionReducer,
  user: userReducer,
  filters: filterReducer,
});

const preloadedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

// Watch for changes and save to disk—debounced so we don't spam the browser
let saveTimer;
store.subscribe(() => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveState(store.getState());
  }, 500);
});
