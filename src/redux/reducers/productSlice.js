import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = "https://ecom-backend-1-0mwh.onrender.com/api/v1";

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export const getAllProducts = createAsyncThunk(
  "/getAllProducts",
  async (
    {
      page = 1,
      search = "",
      category = "",
      minPrice = 0,
      maxPrice = 100000,
      role = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product?page=${page}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}&category=${category}&supplier=${role}`,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials:true
        }
      );
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
export const createProduct = createAsyncThunk(
  "/createProduct",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials:true,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "/updateProduct",
  async ({ formData, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/product/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials:true,
        },
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const productDetail = createAsyncThunk(
  "/productDetail",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/product/${productId}`,{withCredentials:true});
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "/deleteProduct",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/product/${productId}`,{withCredentials:true,}
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

export const supplierProduct = createAsyncThunk(
  "/supplierProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/supplier/product`,{withCredentials:true});
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // if any funtion -- code here & export that
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(productDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(productDetail.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(productDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
