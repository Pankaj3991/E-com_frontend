import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export const getAllCategories = createAsyncThunk(
  "/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/category`,{withCredentials:true});
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

// create or update category --
export const createCategory = createAsyncThunk(
  "/createCategory",
  async ({ categoryData }, { rejectWithValue }) => {
    console.log(categoryData);
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/category`,
        categoryData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials:true
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const categoryDetail = createAsyncThunk(
  "/categoryDetail",
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/category/${categoryId}`, {withCredentials:true}
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "/deleteCategory",
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/admin/category/${categoryId}`,{withCredentials:true}
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // if any funtion -- code here & export that
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(categoryDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(categoryDetail.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(categoryDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
