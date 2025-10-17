import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const initialState = {
  currentuser: {},
  data: [],
  isLoading: false,
  error: null,
};

export const RegisterUser = createAsyncThunk(
  "/register",
  async (formDatas, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, formDatas, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
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

export const LoginUser = createAsyncThunk(
  "/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials:true
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

export const Logout = createAsyncThunk(
  "/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/logout`,{withCredentials:true});
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const currentUser = createAsyncThunk(
  "/currentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/me`,{withCredentials:true,});
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/password/update`,
        passwordData,
        {
          headers: {
            "Content-Type": "application/json",
          },
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

export const updateProfile = createAsyncThunk(
  "/updateProfile",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/me/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials:true
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

export const allUsers = createAsyncThunk(
  "/allUsers",
  async ({ setusers }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/users`,{withCredentials:true});
      setusers(response.data.users);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const singleUser = createAsyncThunk(
  "/singleUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/user/${userId}`,{withCredentials:true});
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const updateRole = createAsyncThunk(
  "/updateRole",
  async ({ newRole, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/user/${userId}`,
        { role: newRole },
        {
          headers: {
            "Content-Type": "application/json",
          },
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

export const deleteUser = createAsyncThunk(
  "/deleteUser",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/admin/user/${userId}`, {withCredentials:true});
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // if any funtion -- code here & export that
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.currentuser = action.payload.user;
        state.isLoading = false;
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(LoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.currentuser = action.payload.user;
        state.isLoading = false;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(Logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Logout.fulfilled, (state, action) => {
        state.currentuser = {};
        state.isLoading = false;
      })
      .addCase(Logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(currentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.currentuser = action.payload.user;
      })
      .addCase(currentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.currentuser = action.payload.user;
        state.isLoading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(allUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(allUsers.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(allUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(singleUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(singleUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(singleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.currentuser = {};
        state.isLoading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
