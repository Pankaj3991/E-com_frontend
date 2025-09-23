import axios from 'axios'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export const placeOrder = createAsyncThunk(
  "/order/placeOrder",
  async ({ orderItem, shippingInfo }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/v1/order/placeOrder",
        { orderItem, shippingInfo },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "/order/cancelOrder",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/api/v1/order/cancelOrder/${orderId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const updateStatus = createAsyncThunk(
  "/order/updateStatus",
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/v1/order/updateStatus/${orderId}`,
        { orderStatus },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const getOrders = createAsyncThunk(
  "/order/getOrders",
  async ( _, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/order/getOrders", {
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

export const supplierOrders = createAsyncThunk(
  "/order/supplierOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/order/supplierOrders", {
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

const orderSlice = createSlice({
  name: "order",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.data = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(supplierOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(supplierOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(supplierOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

  },
});

export default orderSlice.reducer;
