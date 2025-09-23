import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { currentUser } from "../redux/reducers/userSlice";
import Loader from "../components/Loader";

const SupplierAdmin = () => {
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);
  const [loading, setloading] = useState(true);
  const [user, setuser] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const getUser = async () => {
      const response = await dispatch(currentUser());
      await setuser(response.payload.user);
      setloading(false);
    };
    getUser();
  }, []);

  if (loading) return <Loader />;

  if(!user?.role) return <Navigate to="/auth" state={{ from: location }} />;

  return user?.role != "user" ? (
    <Outlet context={{ user }} />
  ) : (
    <Navigate
      to="/"
      
      e={{ message: "Only admin or supplier allowed to access this route" }}
    />
  );
};

export default SupplierAdmin;
