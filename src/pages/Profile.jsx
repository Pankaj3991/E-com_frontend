import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { successMessage, errorMessage } from "../helperFunction.js";
import {
  currentUser,
  Logout,
  clearError,
  updateProfile,
  updatePassword,
} from "../redux/reducers/userSlice";
import Loader from "../components/Loader";
import { useNavigate, useOutletContext } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isLoading, error,currentuser } = useSelector(
    (state) => state.user
  );
  const [reload, setReload] = useState(false);
  const [updateProfileData, setupdateProfileData] = useState({
    name: currentuser?.name,
    avatar: null,
    role: currentuser?.role,
  });
  
  const [updateActive, setupdateActive] = useState(false);
  const [editActive, seteditActive] = useState(false); //for password change form

  useEffect(() => {

  }, [dispatch])
  
  const logout = async () => {
    const response = await dispatch(Logout());
    if (response.payload.success) {
      successMessage(`${response.payload.message}`);
    } else {
      errorMessage(`${response.payload}`);
    }
    navigate("/");
  };

  const [editData, seteditData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleProfileChange = (e) => {
    setupdateProfileData({
      ...updateProfileData,
      [e.target.name]: e.target.value,
    });
  };

  const ProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", updateProfileData.name);
    if (updateProfileData.avatar) {
      formData.append("avatar", updateProfileData.avatar);
    }
    if (currentuser.role !== "admin") {
      formData.append("role", updateProfileData.role);
    }
    const response = await dispatch(updateProfile({ formData }));
    if (response.payload.success) {
      successMessage(`${response.payload.message}`);
    } else {
      errorMessage(`${response.payload}`);
    }
    setupdateActive(false);
    setReload(!reload);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const passwordData = {
      oldPassword: editData.oldPassword,
      newPassword: editData.newPassword,
    };
    const response = await dispatch(updatePassword(passwordData));
    if (response.payload.success) {
      successMessage(`${response.payload.message}`);
      seteditActive(false);
      navigate("/profile");
      setReload(!reload);
    } else {
      errorMessage(`${response.payload}`);
      navigate("/");
    }
  };
  if (isLoading) return <Loader />;
  if (error) {
    console.log(error);
  }

  return (
    <div className="mt-[7vh]">
      {/* update password form */}
      {editActive && (
        <div className="fixed inset-0 w-[100vw] min-h-[100vh] flex items-center justify-center bg-textAndBorder bg-opacity-60 z-20">
          <div className="w-[90vw] md:w-[60vw] lg:w-[40vw] bg-white rounded-xl h-fit px-[5vw] py-[5vh]">
            <div className="flex justify-between mb-4">
              <p className="text-xl font-semibold border-2 border-textAndBorder rounded-lg w-fit p-2">
                Update password
              </p>
              <i
                className="fa-solid fa-xmark text-3xl border-2 border-textAndBorder px-2 pt-1 rounded-full cursor-pointer"
                onClick={() => {
                  seteditActive(false);
                }}
              ></i>
            </div>
            <div>
              <form onSubmit={handleEditSubmit}>
                <label
                  htmlFor="oldPassword"
                  className="block mb-2 font-semibold"
                >
                  Old password:
                </label>
                <input
                  type="text"
                  id="oldPassword"
                  name="oldPassword"
                  value={editData.oldPassword}
                  required
                  onChange={(e) => {
                    seteditData((previous) => ({
                      ...previous,
                      oldPassword: `${e.target.value}`,
                    }));
                  }}
                  className="w-full px-4 py-2 rounded border border-textAndBorder focus:outline-none focus:border-blueColor"
                />

                <label
                  htmlFor="newPassword"
                  className="block mb-2 font-semibold"
                >
                  New password:
                </label>
                <input
                  type="text"
                  id="newPassword"
                  name="newPassword"
                  value={editData.newPassword}
                  required
                  onChange={(e) => {
                    seteditData((previous) => ({
                      ...previous,
                      newPassword: `${e.target.value}`,
                    }));
                  }}
                  className="w-full px-4 py-2 rounded border border-textAndBorder focus:outline-none focus:border-blueColor"
                />

                <button
                  type="submit"
                  className="w-full block py-2 px-4 mt-4 bg-blueColor text-white rounded-md hover:shadow-lg focus:outline-none"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* update profile form */}
      {updateActive && (
        <div className="fixed inset-0 w-[100vw] h-[100vh] flex items-center justify-center bg-textAndBorder bg-opacity-60 z-20">
          <div className="w-[90vw] md:w-[60vw] lg:w-[40vw] bg-white rounded-xl h-fit px-[5vw] py-[5vh]">
            <div className="flex justify-between mb-4">
              <p className="text-xl font-semibold border-2 border-textAndBorder rounded-lg w-fit p-2">
                Update Profile
              </p>
              <i
                className="fa-solid fa-xmark text-3xl border-2 border-textAndBorder px-2 pt-1 rounded-full cursor-pointer"
                onClick={() => {
                  setupdateActive(false);
                }}
              ></i>
            </div>
            <div>
            <form onSubmit={ProfileSubmit}>
              <label className="block mb-2 font-semibold" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={updateProfileData.name}
                onChange={handleProfileChange}
                required
                className="w-full px-4 py-2 rounded border border-textAndBorder focus:outline-none focus:border-blueColor"
              />
              <label className="block mb-2 font-semibold" htmlFor="avatar">
                Profile photo:
              </label>
              <input
                type="file"
                accept="image/*"
                id="avatar"
                name="avatar"
                onChange={(e) => {
                  setupdateProfileData({
                    ...updateProfileData,
                    [e.target.name]: e.target.files[0],
                  });
                }}
                className="w-full px-4 py-2 rounded border border-textAndBorder focus:outline-none focus:border-blueColor"
              />
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={updateProfileData.role === "user"}
                    onChange={handleProfileChange}
                    className="form-radio text-blueColor h-4 w-4"
                  />
                  <span className="ml-2 text-textAndBorder">user</span>
                </label>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="supplier"
                      checked={updateProfileData.role === "supplier"}
                      onChange={handleProfileChange}
                      className="form-radio text-blueColor h-4 w-4"
                    />
                    <span className="ml-2 text-textAndBorder">supplier</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blueColor text-white rounded-md hover:shadow-lg focus:outline-none"
                >
                  Update
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
      {/* profile page */}
      {currentuser?.name ? (
        <div className="w-[100vw] h-[100vh] flex flex-col bg-grayColor lg:flex-row">
          <div className="flex items-center justify-center lg:w-1/3 p-4 border border-textAndBorder">
            {/* profile photo */}
            <div className="h-[30vh] md:h-[60vh] lg:h-[80vh] flex justify-center lg:items-center">
              <img
                src={currentuser.avatar.url} // Replace with your image URL
                alt="user image"
                className="w-full h-full object-contain rounded-2xl hover:shadow-xl transition-transform duration-500 hover:-translate-y-2"
              />
            </div>
          </div>
          <div className="h-[70vh] lg:w-2/3 lg:h-auto p-4 border border-textAndBorder">
            {/* view dashboard icon -----role----- logout icon */}
            <div className="flex justify-between">
              <i
                className={`fa-solid fa-bars text-3xl m-4 cursor-pointer ${
                  currentuser.role == "user" ? "hidden" : ""
                }`}
                onClick={() => {
                  navigate("/dashboard/products");
                }}
              ></i>
              <p className="text-xl border-2 h-fit p-2 rounded-tl-3xl rounded-br-3xl border-textAndBorder">
                {currentuser.role}
              </p>
              <i
                className="fa-solid fa-right-from-bracket text-3xl m-4 cursor-pointer"
                onClick={logout}
              ></i>
            </div>
            {/* Name -- text-9xl with good looking font */}
            <p className="text-5xl md:text-7xl lg:text-9xl font-bebas tracking-wider my-10 mx-4">
              {currentuser.name}
            </p>
            {/* contact me: email address */}
            <i className="fa-solid fa-envelope text-3xl mx-4"></i>
            <p className="inline-block font-semibold text-lg mb-5">
              {currentuser.email}
            </p>
            {/* update profile, update password */}
            <div className="flex my-auto sm:mx-1 lg:mt-20 lg:mx-4 flex-wrap">
              <p
                className="text-lg border-2 h-fit p-2 rounded-xl border-textAndBorder mr-auto m-1 cursor-pointer"
                onClick={() => {
                  setupdateActive(true);
                }}
              >
                Update profile
              </p>
              <p
                className="text-lg border-2 h-fit p-2 rounded-xl border-textAndBorder m-1 cursor-pointer"
                onClick={() => {
                  seteditActive(true);
                }}
              >
                Update password
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          Login to see user details
        </div>
      )}
    </div>
  );
};

export default Profile;
