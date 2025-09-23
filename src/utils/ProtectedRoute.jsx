import React, { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { Outlet, Navigate, useLocation} from "react-router-dom";
import { currentUser} from "../redux/reducers/userSlice";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const {currentuser} = useSelector((state)=>state.user);
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

  return user?.name ? <Outlet context={{ user }} /> : <Navigate to="/auth" state={{ from: location }}/>;
};

export default ProtectedRoute;
