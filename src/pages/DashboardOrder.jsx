import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { successMessage, errorMessage } from "../helperFunction.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../components/Loader.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import { supplierOrders, updateStatus, cancelOrder } from "../redux/reducers/orderSlice.js";
import { useNavigate } from "react-router-dom";

const DashboardOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSelector((state) => state.product);
  const { currentuser } = useSelector((state) => state.user);
  const [reload, setreload] = useState(false);
  const [orders, setorders] = useState("");
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await dispatch(supplierOrders());
      if (response.payload.success) {
        successMessage(response.payload.message);
        setorders(response.payload.filteredOrders);
      } else {
        console.log(response.payload);
      }
    };
    fetchOrders();
  }, [reload]);

  // Handle collapsible product details
  const toggleOrderDetails = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable auto slide
    autoplaySpeed: 3000, // Set the interval time (3 seconds)
  };
  if (isLoading) return <Loader />;
  if (error) {
    console.log(error);
  }
  return (
    <div className="box-border min-h-[100vh] w-[100vw] flex flex-col lg:flex-row mt-[7vh]">
      <DashboardSidebar />
      {orders.length >0 ? (
        <div className="w-[100vw] min-h-[100vh] mt-24 lg:mt-0 lg:ml-[25vw] lg:w-[75vw] bg-whiteColor lg:p-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`my-4 border border-textAndBorder rounded-lg p-1 ${order.orderStatus == 'Delivered' ? 'hidden' : ''} `}
            >
              <div
                className="flex justify-between p-4 cursor-pointer bg-grayColor hover:shadow-md rounded-lg"
                onClick={() => toggleOrderDetails(order._id)}
              >
                <h2 className="text-lg font-semibold">
                  {order.orderItem.name}
                </h2>
                <span>{openOrderId === order._id ? "-" : "+"}</span>
              </div>
              {openOrderId === order._id && (
                <div className="w-full px-[2vw] py-[2vh]">
                  {/* order details */}
                  <div className="text-lg font-bebas tracking-wide">
                    {order.orderItem.name}
                  </div>
                  <div className="">
                    <span className="font-semibold">Product Id: </span>{" "}
                    <span>{order.orderItem.product._id}</span>
                  </div>
                  <div className="">
                    <span className="font-semibold">Order status: </span>
                    <span>{order.orderStatus}</span>
                  </div>
                  <div className="">
                    <span className="font-semibold">Quantity: </span>
                    <span>{order.orderItem.quantity}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-lg font-semibold my-[1vh] p-2 border border-textAndBorder w-fit rounded-tl-3xl rounded-br-3xl">
                      Shipping details:{" "}
                    </div>
                    <div className="">
                      <span className="font-semibold">Phone: </span>
                      <span>{order.shippingInfo.phone}</span>
                    </div>
                    <div className="">
                      <span className="font-semibold">Address: </span>
                      <span>{order.shippingInfo.address}</span>
                    </div>
                    <div className="">
                      <span className="font-semibold">City: </span>
                      <span>{order.shippingInfo.city}</span>
                    </div>
                    <div className="">
                      <span className="font-semibold">State: </span>
                      <span>{order.shippingInfo.state}</span>
                    </div>
                    <div className="">
                      <span className="font-semibold">Postal code: </span>
                      <span>{order.shippingInfo.postalCode}</span>
                    </div>
                    <div className="">
                      <span className="font-semibold">Country: </span>
                      <span>{order.shippingInfo.country}</span>
                    </div>
                  </div>
                  {/* update status */}
                  <label
                    htmlFor="order-status"
                    className={`font-semibold ${
                      order.orderStatus == "Delivered" ? "hidden" : ""
                    }`}
                  >
                    Update Order Status:{" "}
                  </label>
                  <select
                    id="order-status"
                    className={`border border-textAndBorder p-2 rounded-lg ${
                      order.orderStatus == "Delivered" ? "hidden" : ""
                    }`}
                    value={order.orderStatus}
                    onChange={async (e) => {
                      const response = await dispatch(
                        updateStatus({
                          orderId: order._id,
                          orderStatus: e.target.value,
                        })
                      );
                      if (response.payload.success) {
                        setreload(!reload);
                        successMessage(response.payload.message);
                      } else {
                        errorMessage(response.payload);
                      }
                    }}
                  >
                    <option value="">Select a status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  {/* cancel order button */}
                  <button
                    className={`${
                      order.orderStatus === "Delivered" ? "hidden" : ""
                    } w-fit p-2 mt-[1vh] bg-redColor rounded block`}
                    onClick={async () => {
                      const response = await dispatch(
                        cancelOrder({ orderId: order._id })
                      );
                      if (response.payload.success) {
                        successMessage(response.payload.message);
                        setreload(!reload);
                      } else {
                        errorMessage(response.payload);
                      }
                    }}
                  >
                    Cancel order
                  </button>
                </div>
            )}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-[100vw] min-h-[100vh] mt-24 lg:mt-0 lg:ml-[25vw] lg:w-[75vw] bg-whiteColor lg:p-4 flex flex-col items-center justify-center h-[100vh] gap-[3vh]">
          <div className="text-xl">No order found</div>
          <button
            className="w-fit p-2 bg-blueColor rounded-lg font-semibold text-lg cursor-pointer"
            onClick={() => {
              navigate("/listing");
            }}
          >
            Explore products
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardOrder;
