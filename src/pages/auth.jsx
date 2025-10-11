import React, { useEffect, useState } from "react";
import {
  RegisterUser,
  LoginUser,
  clearError,
} from "../redux/reducers/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {successMessage, errorMessage} from '../helperFunction.js'
import Loader from "../components/Loader.jsx";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { data, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Clear any existing error when the component is loaded
    dispatch(clearError());
    // Optionally, clear error on component unmount
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar: null,
    email: "",
    password: "",
    role: "user",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = new FormData();
    if (isRegistering) {
      formDatas.append("name", formData.name);
      formDatas.append("avatar", formData.avatar);
      formDatas.append("email", formData.email);
      formDatas.append("password", formData.password);
      formDatas.append("role", formData.role);
      const response = await dispatch(RegisterUser(formDatas));
      if (response?.payload?.success) {
        successMessage(`${response.payload.message}`);
        navigate(from);
      } else {
        errorMessage(`${response.payload}`);
        navigate("/");
      }
    } else {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };
      const response = await dispatch(LoginUser(loginData));
      if (response.payload.success) {
        successMessage(`${response.payload.message}`);
        navigate(from);
      } else {
        errorMessage(`${response.payload}`);
        navigate("/");
      }
    }
  };
  if (isLoading) return <Loader />;
  if (error){console.log(error)}
  return (
    <div className="signup mt-[7vh] flex items-center justify-center min-h-screen bg-grayColor">
      <div className="bg-whiteColor px-[5vw] py-[5vh] min-w-fit rounded-lg shadow-md max-w-[80vw]">
        <div className="flex justify-between mb-4">
          <button
            className={`py-2 px-4 text-lg font-semibold ${
              isRegistering ? "text-grayColor" : "text-blueColor"
            } focus:outline-none`}
            onClick={() => setIsRegistering(false)}
          >
            Login
          </button>
          <button
            className={`py-2 px-4 text-lg font-semibold ${
              isRegistering ? "text-blueColor" : "text-grayColor"
            } focus:outline-none`}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </button>
        </div>
        <div className="flex justify-center items-center max-w-[80vw]">
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="mb-4">
              <label className="block mb-2 font-semibold" htmlFor="name">
                Username
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
              />
              <label className="block mb-2 font-semibold" htmlFor="avatar">
                Profile photo:
              </label>
              <input
                type="file"
                accept="image/*"
                id="avatar"
                name="avatar"
                required
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.files[0],
                  });
                }}
                className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500 mb-4"
              />

              {/* User Role */}
              <div className="mb-2">
                <span className="block mb-2 font-semibold">Role:</span>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === "user"}
                    onChange={handleInputChange}
                    className="form-radio text-blueColor h-4 w-4"
                  />
                  <span className="ml-2 text-textAndBorder">user</span>
                </label>
              </div>

              {/* Supplier Role */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="supplier"
                    checked={formData.role === "supplier"}
                    onChange={handleInputChange}
                    className="form-radio text-indigo-blueColor h-4 w-4"
                  />
                  <span className="ml-2 text-textAndBorder">supplier</span>
                </label>
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded border border-grayColor focus:outline-none focus:border-blueColor"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded border border-grayColor focus:outline-none focus:border-blueColor"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blueColor font-bold rounded hover:shadow-md focus:outline-none"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
