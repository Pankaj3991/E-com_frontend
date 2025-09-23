import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { currentUser } from "../redux/reducers/userSlice";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const response = await dispatch(currentUser());
      setUser(response.payload.user); // no need for await
      setLoading(false);
    };
    getUser();
  }, [dispatch]);

  if (loading) return <Loader />;

  return user?.name ? <Outlet /> : <Navigate to="/auth" state={{ from: location }} />;
};

export default ProtectedRoute;