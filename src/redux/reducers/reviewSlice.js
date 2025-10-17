import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

// get all reviews of a product.
export const getAllReviews = createAsyncThunk(
  "/getAllReviews",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/review/${productId}`,{withCredentials:true});
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// create or update review
export const createReview = createAsyncThunk(
  "/createReview",
  async ({ reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.post("${BASE_URL}/review", reviewData, {
        headers: { "Content-Type": "application/json" },
        withCredentials:true,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "deleteReview",
  async ({ reviewId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/review/${reviewId}`,{withCredentials:true});
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    // if any funtion -- code here & export that
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
