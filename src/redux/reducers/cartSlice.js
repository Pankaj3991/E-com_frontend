import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;


const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export const addItem = createAsyncThunk(
  "/addItem",
  async ({ productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/cart/addItem`, productData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const removeItem = createAsyncThunk(
  "/removeItem",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/cart/removeItem/${productId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const cartDetail = createAsyncThunk(
  "/cartDetail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/cart`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // if any funtion -- code here & export that
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {      
    builder
      .addCase(removeItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
      
    builder
      .addCase(cartDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cartDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(cartDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
