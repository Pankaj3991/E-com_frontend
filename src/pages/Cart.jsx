import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartDetail, removeItem } from "../redux/reducers/cartSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../components/Loader";
import { addItem } from "../redux/reducers/cartSlice";
import { errorMessage, successMessage } from "../helperFunction";
import { useNavigate } from "react-router-dom";
import {
  placeOrder,
  getOrders,
  cancelOrder,
} from "../redux/reducers/orderSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSelector((state) => state.cart);
  const [reload, setreload] = useState(false);
  const [count, setcount] = useState(1);
  const [cartOpen, setcartOpen] = useState(true);
  const [cart, setcart] = useState([]);
  const [shippingInfo, setshippingInfo] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [shippingOpen, setshippingOpen] = useState(false);
  const [userOrders, setuserOrders] = useState([]);

  useEffect(() => {
    const getCart = async () => {
      const response = await dispatch(cartDetail());
      setcart(response.payload.cart[0]);
    };
    const getOrder = async () => {
      const response = await dispatch(getOrders());
      if (response.payload.success) {
        setuserOrders(response.payload.orders);
      } else {
        console.log(response.payload);
      }
    };
    getCart();
    getOrder();
  }, [reload]);

  const [shipItem, setshipItem] = useState({
    product: "",
    quantity: "",
  });
  const handleShipChange = (e) => {
    setshippingInfo((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShipSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      placeOrder({ orderItem: shipItem, shippingInfo })
    );
    if (response.payload.success) {
      successMessage(response.payload.message);
      setshippingOpen(false);
      setreload(!reload);
      setshippingInfo({
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
    } else {
      setshippingOpen(false);
      errorMessage(response.payload);
    }
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

  const addToCart = async (id) => {
    const productData = { productId: id, quantity: count };
    const response = await dispatch(addItem({ productData }));
    if (response?.payload?.success) {
      successMessage(response.payload.message);
      setcount(1);
    } else {
      errorMessage(response.payload);
    }
  };

  if (isLoading) return <Loader />;
  if (error) {
    console.log(error);
  }

  return (
    <div className="mt-[7vh] min-h-[100vh]">
      <div className="flex w-[100vw] h-fit py-[1vh] justify-between px-[5vw]">
        <button
          className={`text-lg font-semibold ${
            cartOpen ? "text-blueColor" : "text-grayColor"
          } `}
          onClick={() => setcartOpen(true)}
        >
          Cart
        </button>
        <button
          className={`text-lg font-semibold ${
            !cartOpen ? "text-blueColor" : "text-grayColor"
          } `}
          onClick={() => setcartOpen(false)}
        >
          Oders
        </button>
      </div>
      {shippingOpen && (
        <div className="fixed w-[100vw] h-[100vh] inset-0 bg-textAndBorder bg-opacity-70 z-30 flex justify-center items-center">
          <div className="w-[90vw] md:w-[80vw] lg:w-[70vw] bg-whiteColor overflow-auto px-[5vw] py-[5vh]">
            <div className="flex justify-between mb-4">
              <p className="text-xl font-semibold border border-textAndBorder rounded-lg w-fit p-2">
                Shipping details
              </p>
              <i
                className="fa-solid fa-xmark text-3xl border border-textAndBorder px-2 pt-1 rounded-full cursor-pointer"
                onClick={() => {
                  setshippingOpen(false);
                }}
              ></i>
            </div>
            <div className="">
              <form onSubmit={handleShipSubmit}>
                <label htmlFor="phone" className="block mb-1 font-semibold">
                  Phone:
                </label>
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  required
                  onChange={handleShipChange}
                  className="w-full px-4 py-1 rounded border border-gray-400 focus:outline-none focus:border-blue-400"
                />

                <label htmlFor="address" className="block mb-1 font-semibold">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  required
                  onChange={handleShipChange}
                  className="w-full px-4 py-1 rounded border border-gray-400 focus:outline-none focus:border-blue-400"
                />

                <label htmlFor="city" className="block mb-1 font-semibold">
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  required
                  onChange={handleShipChange}
                  className="w-full px-4 py-1 rounded border border-gray-400 focus:outline-none focus:border-blue-400"
                />

                <label htmlFor="state" className="block mb-1 font-semibold">
                  State:
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingInfo.state}
                  required
                  onChange={handleShipChange}
                  className="w-full px-4 py-1 rounded border border-gray-400 focus:outline-none focus:border-blue-400"
                />

                <label htmlFor="country" className="block mb-1 font-semibold">
                  Country:
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingInfo.country}
                  required
                  onChange={handleShipChange}
                  className="w-full px-4 py-1 rounded border border-gray-400 focus:outline-none focus:border-blue-400"
                />

                <label
                  htmlFor="postalCode"
                  className="block mb-1 font-semibold"
                >
                  Postal Code:
                </label>
                <input
                  type="number"
                  id="postalCode"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  required
                  onChange={handleShipChange}
                  className="w-full px-4 py-1 rounded border border-gray-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className={`w-full py-2 bg-blueColor px-4 mt-4 font-semibold hover:shadow-lg rounded-md focus:outline-none`}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {cartOpen && (
        <div className={`flex flex-col items-center justify-center`}>
          <div
            className={`w-[100vw] h-[100vh] px-[5vw] ${
              cart?.cartItems?.length ? "hidden" : "flex"
            } flex-col justify-center items-center gap-[3vh]`}
          >
            <div className="text-xl">No product in cart</div>
            <button
              className="w-fit p-2 bg-blueColor rounded-lg font-semibold text-lg "
              onClick={() => {
                navigate("/listing");
              }}
            >
              Explore products
            </button>
          </div>
          {cart.cartItems?.map((item, index) => (
            <div
              key={index}
              className="flex w-[100vw] pl-[10vw] border border-textAndBorder rounded my-[3vh] py-[5vh]"
            >
              <div className="w-[15vw]">
                {item.product.images.length > 1 ? (
                  <Slider {...settings}>
                    {item.product.images.map((image, index) => (
                      <div key={index} className="slide">
                        <img
                          src={image.url} // Assuming the image URL is returned in `image.url`
                          alt={`Slide ${index + 1}`}
                          className="w-20 h-auto rounded-lg mx-auto"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img src={item.product.images[0].url} alt="" className="w-20 h-auto rounded-lg mx-auto"/>
                )}
              </div>
              <div className="w-[75vw] flex flex-col justify-between">
                <div className="flex justify-between mx-[10vw]">
                  <div className="text-xl lg:text-2xl font-bebas">
                    {item.product.name}
                  </div>
                  <i className="fa-solid fa-trash text-xl block cursor-pointer" onClick={async ()=>{
                    const response = await dispatch(removeItem({productId:item.product._id}))
                    if(response.payload.success){
                      setreload(!reload);
                      successMessage(response.payload.message);
                    }else{
                      errorMessage(response.payload);
                    }
                  }}></i>
                </div>

                <div className="flex justify-between mx-[10vw]">
                  <div className="">₹ {item.quantity * item.product.price}</div>

                  <div className="flex gap-2 lg:gap-4 mb-[2vh]">
                    <button
                      className="border border-textAndBorder px-1 rounded cursor-pointer"
                      onClick={async () => {
                        if (item.quantity > 1) {
                          const response = await dispatch(
                            addItem({
                              productData: {
                                productId: item.product._id,
                                quantity: item.quantity - 1,
                              },
                            })
                          );
                          setreload(!reload);
                          successMessage(response.payload.message);
                        }
                      }}
                    >
                      -
                    </button>
                    <div className="border-b border-textAndBorder px-2">
                      {item.quantity}
                    </div>
                    <button
                      className="border border-textAndBorder px-1  rounded cursor-pointer"
                      onClick={async () => {
                        if (item.product.stock > item.quantity) {
                          const response = await dispatch(
                            addItem({
                              productData: {
                                productId: item.product._id,
                                quantity: item.quantity + 1,
                              },
                            })
                          );
                          setreload(!reload);
                          successMessage(response.payload.message);
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div
                  className={`${
                    item.product.stock > 0 ? "text-green-400" : "text-redColor"
                  } mx-auto`}
                >
                  {item.product.stock > 0
                    ? `Only ${item.product.stock} items are available`
                    : "Out of Stock"}
                </div>
                <button
                  className="w-10/12 mx-auto mt-[1vh] bg-yellow-400 p-2 font-semibold hover:shadow-lg"
                  onClick={() => {
                    setshippingOpen(true);
                    setshipItem((previous) => ({
                      ...previous,
                      product: item.product._id,
                      quantity: item.quantity,
                    }));
                  }}
                >
                  Place order
                </button>
              </div>
            </div>
          ))}
          <div
            className={`${
              cart?.totalPrice ? "" : "hidden"
            } border border-textAndBorder flex justify-center items-center py-[1vh] w-[100vw]`}
          >
            <span className="font-semibold mr-3">Total :</span>₹{" "}
            {cart?.totalPrice}
          </div>
        </div>
      )}
      {!cartOpen && (
        <div className="flex flex-col justify-center items-center">
          <div
            className={`w-[100vw] h-[100vh] px-[5vw] ${
              userOrders?.length ? "hidden" : "flex"
            } flex-col justify-center items-center gap-[3vh]`}
          >
            <div className="text-xl">No Orders placed</div>
            <button
              className="w-fit p-2 bg-blueColor rounded-lg font-semibold text-lg "
              onClick={() => {
                navigate("/listing");
              }}
            >
              Explore products
            </button>
          </div>
          {userOrders?.map((order, index) => (
            <div
              key={index}
              className="flex w-[100vw] pl-[10vw] border border-textAndBorder rounded my-[3vh] py-[5vh]"
            >
              <div className="w-[15vw]">
                {order.orderItem.images.length > 1 ? (
                  <Slider {...settings}>
                    {order.orderItem.images.map((image, index) => (
                      <div key={index} className="slide">
                        <img
                          src={image.url} // Assuming the image URL is returned in `image.url`
                          alt={`Slide ${index + 1}`}
                          className="w-20 h-auto rounded-lg mx-auto"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img src={order.orderItem.images[0].url} alt="" className="w-auto h-40 rounded-lg mx-auto"/>
                )}{" "}
              </div>
              <div className="w-[75vw] flex flex-col items-center">
                <div className="text-xl font-bebas tracking-wider">
                  {order.orderItem.name}
                </div>
                <div className="">
                  <span className="mx-2 ">Order status:</span>
                  <span className="mx-2 font-semibold text-lg tracking-wide">{order.orderStatus}</span>
                </div>
                <button
                  className={`${order.orderStatus==='Delivered' ? 'hidden' : ''} w-fit p-2 mx-auto bg-redColor rounded`}
                  onClick={async () => {
                    const response = await dispatch(cancelOrder({ orderId: order._id }));
                    if(response.payload.success){
                      successMessage(response.payload.message);
                      setreload(!reload);
                    }else{
                      errorMessage(response.payload);
                    }
                  }}
                >
                  Cancel order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>
        {`
        .slick-prev::before, .slick-next::before {
          color: #1f2937; /* Custom color for arrows (gray-800 in Tailwind) */
        }
        // .slick-prev {
        //   left: 10px; /* Adjust position if needed */
        // }
        // .slick-next {
        //   right: 10px; /* Adjust position if needed */
        // }
        `}
      </style>
    </div>
  );
};

export default Cart;
