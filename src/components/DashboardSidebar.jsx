import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const DashboardSidebar = () => {
  const {currentuser} = useSelector((state)=> state.user);
  return (
    <div className="fixed top-0 left-0 w-[100vw] h-24 p-2 lg:min-h-[100vh] lg:w-[25vw] bg-grayColor lg:p-4 flex lg:flex-col justify-evenly items-center flex-wrap z-10 mt-[7vh]">
      <NavLink to={'/dashboard/products'} className="px-2 h-fit cursor-pointer my-1">
        <i className="fa-solid fa-box-open text-xl mx-1 lg:text-3xl lg:mx-2"></i>
        <span className="text-xl mx-1 lg:text-3xl lg:mx-2">Products</span>
      </NavLink>
      <NavLink to={'/dashboard/orders'} className="px-2 h-fit cursor-pointer my-1">
        <i className="fa-solid fa-truck text-xl mx-1 lg:text-3xl lg:mx-2"></i>
        <span className="text-xl mx-1 lg:text-3xl lg:mx-2">Orders</span>
      </NavLink>
      <NavLink to={'/dashboard/users'} className={`${currentuser.role == 'supplier' ? 'hidden' : ''} px-2 h-fit cursor-pointer my-1`}>
        <i className="fa-solid fa-user text-xl mx-1 lg:text-3xl lg:mx-2"></i>
        <span className="text-xl mx-1 lg:text-3xl lg:mx-2">User</span>
      </NavLink>
      <NavLink to={'/dashboard/reviews'} className= {`${currentuser.role == 'supplier' ? 'hidden' : ''} px-2 h-fit cursor-pointer my-1`}>
        <i className="fa-solid fa-comment-dots text-xl mx-1 lg:text-3xl lg:mx-2"></i>
        <span className="text-xl mx-1 lg:text-3xl lg:mx-2">Reviews</span>
      </NavLink>
      <NavLink to={'/dashboard/category'} className={`${currentuser.role == 'supplier' ? 'hidden' : ''} px-2 h-fit cursor-pointer my-1`}>
        <i className="fa-solid fa-list text-xl  mx-1 lg:text-3xl lg:mx-2"></i>
        <span className="text-xl mx-1 lg:text-3xl lg:mx-2">Category</span>
      </NavLink>
    </div>
  );
};

export default DashboardSidebar;
