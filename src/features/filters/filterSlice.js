import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dateRange: {
    start: null,
    end: null,
  },
  category: "All",
  type: "All",
  searchText: "",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setDateRange,
  setCategory,
  setType,
  setSearchText,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
