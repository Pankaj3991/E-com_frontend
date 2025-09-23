import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StarRatingComponent from "react-star-rating-component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { clearError, productDetail } from "../redux/reducers/productSlice";
import { createReview, getAllReviews } from "../redux/reducers/reviewSlice";
import { errorMessage, successMessage } from "../helperFunction";
import { addItem } from "../redux/reducers/cartSlice";
import { placeOrder } from "../redux/reducers/orderSlice";

const ProductDetail = () => {
  const { productId } = useParams();
  const { currentuser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading, error } = useSelector((state) => state.product);
  const [count, setcount] = useState(1);
  const [product, setproduct] = useState("");
  const [reviews, setreviews] = useState([]);
  const [reviewOpen, setreviewOpen] = useState(false);
  const [ratingInput, setratingInput] = useState(1);
  const [commentInput, setcommentInput] = useState("");
  const [reload, setreload] = useState(false);
  const [shippingInfo, setshippingInfo] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [shippingOpen, setshippingOpen] = useState(false);
  const [orderItem, setorderItem] = useState({
    product: "",
    quantity: "",
  });

  useEffect(() => {
    dispatch(clearError());
    const getDetail = async () => {
      const response = await dispatch(productDetail({ productId: productId }));
      if (response?.payload?.success) {
        setproduct(response.payload.product);
      }
    };

    const getReviews = async () => {
      const response = await dispatch(getAllReviews({ productId }));
      if (response?.payload?.success) {
        setreviews(response.payload.reviews);
      }
    };
    if (productId) {
      getDetail();
      getReviews();
    }
  }, [reload]);

  const handleShipChange = (e) => {
    setshippingInfo((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShipSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(placeOrder({ orderItem, shippingInfo }));
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

  const handleReview = async (e) => {
    e.preventDefault();
    const reviewData = {
      product: productId,
      rating: ratingInput,
      comment: commentInput,
    };
    const response = await dispatch(createReview({ reviewData }));
    if (response?.payload?.message) {
      successMessage(response.payload.message);
      setreload(!reload);
    } else {
      errorMessage(response.payload);
    }
    setreviewOpen(false);
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
    <div className="mt-[7vh]">
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

      {product && (
        <div className="flex flex-col lg:flex-row lg:h-[80vh]">
          <div className="w-full lg:w-1/3 border border-textAndBorder rounded-lg">
            <div className="w-full p-[5vh] box-border max-h-[80vh]">
              {product.images.length > 1 ? (
                <Slider {...settings}>
                  {product.images.map((image, index) => (
                    <div key={index} className="slide">
                      <img
                        src={image.url} // Assuming the image URL is returned in `image.url`
                        alt={`Slide ${index + 1}`}
                        className="w-auto max-h-[50vh] lg:max-h-[70vh] rounded-lg mx-auto"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <img
                  src={product.images[0].url}
                  alt=""
                  className="w-auto max-h-[50vh] lg:max-h-[70vh] rounded-lg mx-auto"
                />
              )}
            </div>
          </div>
          <div className="w-full lg:w-2/3 bg-grayColor border border-textAndBorder rounded-lg flex flex-col px-[5vw] py-[5vh]">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bebas mb-[2vh]">
              {product.name}
            </div>
            <div className="font-semibold mb-[2vh]">₹ {product.price}</div>
            {product.stock > 0 && (
              <div className="mb-[2vh]">
                Only {product.stock} items are available
              </div>
            )}

            <div className="mb-[2vh]">
              {product.stock > 0 ? (
                <div className="text-green-600 text-lg">In Stock</div>
              ) : (
                <div className="text-redColor text-lg"></div>
              )}
            </div>
            <div className="flex gap-5 mb-[2vh]">
              <div className="font-semibold">Quanity: </div>
              <button
                className="text-2xl border border-textAndBorder px-3 rounded cursor-pointer"
                onClick={() => {
                  if (count > 1) {
                    setcount(count - 1);
                  }
                }}
              >
                -
              </button>
              <div className="px-3 pt-1 border border-textAndBorder rounded">
                {count}
              </div>
              <button
                className="text-2xl border border-textAndBorder px-2 rounded cursor-pointer"
                onClick={() => {
                  if (product.stock > count) {
                    setcount(count + 1);
                  }
                }}
              >
                +
              </button>
            </div>
            <div className="flex justify-evenly">
              <button
                type="submit"
                disabled={product.stock < 1}
                className={`${
                  product.stock < 1 ? "bg-redColor" : "bg-blueColor"
                } w-1/3 py-2 px-4 mt-4 font-semibold rounded-md focus:outline-none hover:shadow-lg mb-[5vh]`}
                onClick={() => addToCart(product._id)}
              >
                Add to cart
              </button>

              <button
                type="submit"
                disabled={product.stock < 1}
                className={`${
                  product.stock < 1 ? "bg-redColor" : "bg-yellow-400"
                } w-1/3 py-2 px-4 mt-4 font-semibold rounded-md focus:outline-none hover:shadow-lg mb-[5vh]`}
                onClick={() => {
                  setshippingOpen(true);
                  setorderItem((previous) => ({
                    ...previous,
                    product: product._id,
                    quantity: count,
                  }));
                }}
              >
                Place order
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="font-bold text-lg">About this item:</div>
              <div className="ml-5 lg:h-[10vh] lg:overflow-y-auto scrollbar-custom">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex p-[5vh] w-full">
        <div className="text-2xl font-bebas mb-[2vh]">Product's Reviews</div>
        <i
          className="fa-solid fa-circle-plus block text-3xl ml-5 cursor-pointer"
          onClick={() => {
            if (currentuser?.name) {
              setreviewOpen(true);
            } else {
              navigate("/auth", { state: { from: location } });
            }
          }}
        ></i>
      </div>

      {reviewOpen && (
        <div className="w-full md:w-[80vw] lg:w-[50vw] p-2 h-fit border border-textAndBorder mb-[5vh] mx-auto px-[2vw] py-[2vh] rounded-lg">
          <form onSubmit={handleReview}>
            <span>Rating: </span>
            <div className="inline-block text-2xl ml-5">
              <StarRatingComponent
                name="rate" // name is required
                starCount={5} // Number of stars
                value={ratingInput} // Current rating value
                onStarClick={(nextValue) => {
                  setratingInput(nextValue);
                }} // Function called on clicking a star
              />
            </div>
            <label htmlFor="comment" className="block">
              Comment:{" "}
            </label>
            <textarea
              id="comment"
              name="comment"
              rows="4"
              value={commentInput}
              onChange={(e) => {
                setcommentInput(e.target.value);
              }}
              className="w-full p-3 border border-grayColor rounded-md shadow-sm focus:ring-blueColor focus:border-blueColor sm:text-sm"
              placeholder="Type your Comment here..."
            />
            <button
              type="submit"
              className={`w-full py-2 px-4 mt-4 border bg-blueColor rounded-md focus:outline-none hover:shadow`}
            >
              Submit
            </button>
          </form>
        </div>
      )}

      <div className="flex justify-evenly flex-wrap gap-[3vh] mb-[5vh]">
        {reviews?.map((review) => (
          <div
            className="w-3/4 lg:w-1/3 border rounded p-2 flex flex-col"
            key={review._id}
          >
            <div className="flex justify-around p-2 w-full">
              <div className="w-20 h-20 rounded-full bg-grayColor p-1">
                <img
                  src={review.user.avatar.url}
                  alt=""
                  className="w-full h-full rounded-full object-contain"
                />
              </div>
              <div className="text-xl flex flex-col">
                <div className="">{review.user.name}</div>
                <div className="">
                  <StarRatingComponent
                    name={review.user.name} // Name of the rating component (required)
                    starCount={5} // Number of stars
                    value={review.rating} // Initial rating value
                    starColor="red" // Color of the stars
                    emptyStarColor="#333" // Color of empty stars
                  />
                </div>
              </div>
            </div>
            <div className="mt-[3vh] p-5">{review.comment}</div>
          </div>
        ))}
      </div>
      <style>
        {`
        .slick-prev::before, .slick-next::before {
          color: #1f2937; /* Custom color for arrows (gray-800 in Tailwind) */
        }
        .slick-prev {
          left: 20px; /* Adjust position if needed */
        }
        .slick-next {
          right: 20px; /* Adjust position if needed */
        }
        
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: #888; /* Custom scrollbar color */
          border-radius: 10px;
          border: 2px solid transparent;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
        `}
      </style>
    </div>
  );
};

export default ProductDetail;
