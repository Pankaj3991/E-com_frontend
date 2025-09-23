import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  allUsers,
  clearError,
  deleteUser,
  updateRole,
} from "../redux/reducers/userSlice";
import Loader from "../components/Loader";
import { successMessage, errorMessage } from "../helperFunction.js";

const DashboardUser = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.user);
  const [users, setusers] = useState([]);
  const [reload, setreload] = useState(false);
  const [openUserId, setopenUserId] = useState(null);
  useEffect(() => {
    dispatch(clearError());
    dispatch(allUsers({ setusers }));
  }, [reload]);

  // Handle collapsible user details
  const toggleUserDetails = (id) => {
    setopenUserId(openUserId === id ? null : id);
  };

  const handleRoleChange = async (id, e) => {
    const response = await dispatch(
      updateRole({ newRole: e.target.value, userId: id })
    );
    if (response.payload.success) {
      successMessage(response.payload.message);
      setreload(!reload);
    } else {
      errorMessage(response.payload);
    }
  };

  if (isLoading) return <Loader />;
  if (error){console.log(error)}

  return (
    <div className="box-border min-h-[50vh] w-[100vw] flex flex-col lg:flex-row mt-[7vh]">
      <DashboardSidebar />
      {/* users listing -- collapsable */}
      <div className="w-[100vw] min-h-[100vh] mt-24 lg:mt-0 lg:ml-[25vw] lg:w-[75vw] bg-whiteColor lg:p-4">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">List of users</h1>

          {users?.map((user) => (
            <div
              key={user._id}
              className="mb-4 border border-textAndBorder rounded-lg p-1"
            >
              <div
                className="flex justify-between p-4 cursor-pointer bg-grayColor hover:shadow-md rounded-lg"
                onClick={() => toggleUserDetails(user._id)}
              >
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <span>{openUserId === user._id ? "-" : "+"}</span>
              </div>

              {openUserId === user._id && (
                <div className="flex flex-col w-full lg:flex-row">
                  {/* images */}
                  <div className="lg:w-1/4 p-8">
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="w-auto h-[30vh] mx-auto lg:w-full lg:h-auto"
                    />
                  </div>
                  {/* product details */}
                  <div className="p-4 bg-whiteColor lg:w-3/4">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bebas">
                      {user.name}
                    </div>
                    <div className="">
                      <span className="font-bold">Email: </span>
                      <span className="italic">{user.email}</span>
                    </div>

                    <div className="flex">
                      <label className="flex items-center mr-3 cursor-pointer">
                        <input
                          type="radio"
                          id="user"
                          name="user"
                          value="user"
                          checked={user.role === "user"} // Compare state to set checked
                          onChange={(e) => {
                            handleRoleChange(user._id, e);
                          }} // Handle change event
                          className="form-radio text-blueColor h-4 w-4 mr-1 cursor-pointer"
                        />
                        <span>user</span>
                      </label>
                      <br />
                      <label className="flex items-center mr-3 cursor-pointer">
                        <input
                          type="radio"
                          id="user"
                          name="user"
                          value="supplier"
                          checked={user.role === "supplier"}
                          onChange={(e) => {
                            handleRoleChange(user._id, e);
                          }}
                          className="form-radio text-blueColor h-4 w-4 mr-1 cursor-pointer"
                        />
                        <span>supplier</span>
                      </label>
                      <br />
                      <label className="flex items-center mr-3 cursor-pointer">
                        <input
                          type="radio"
                          id="user"
                          name="admin"
                          value="admin"
                          checked={user.role === "admin"}
                          onChange={(e) => {
                            handleRoleChange(user._id, e);
                          }}
                          className="form-radio text-blueColor h-4 w-4 mr-1 cursor-pointer"
                        />
                        <span>admin</span>
                      </label>
                      <br />
                    </div>
                    <div
                      className="p-2 bg-redColor rounded-lg w-fit mt-3"
                      onClick={async () => {
                        const response = await dispatch(
                          deleteUser({ userId: user._id })
                        );
                        if (response.payload.success) {
                          successMessage(response.payload.message);
                          setreload(!reload);
                        } else {
                          errorMessage(response.payload);
                        }
                      }}
                    >
                      Delete user
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
