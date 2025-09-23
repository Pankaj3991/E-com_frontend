import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import ReactStars from "react-rating-stars-component"; // ✅ new library
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "../redux/reducers/reviewSlice";
import { errorMessage } from "../helperFunction";
import Loader from "../components/Loader";

const DashboardReview = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.review);
  const [productId, setproductId] = useState("");
  const [reviews, setreviews] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(getAllReviews({ productId }));
    if (response.payload.success) {
      setreviews(response.payload.reviews);
    } else {
      errorMessage(response.payload);
    }
  };

  if (isLoading) return <Loader />;
  if (error) {
    console.log(error);
  }

  return (
    <div className="box-border min-h-[50vh] w-[100vw] bg-grayColor flex flex-col lg:flex-row mt-[7vh]">
      <DashboardSidebar />
      <div className="w-[100vw] min-h-[100vh] mt-24 lg:mt-0 lg:ml-[25vw] lg:w-[75vw] bg-whiteColor p-4">
        <form onSubmit={handleSubmit} className="my-4">
          <input
            type="text"
            placeholder="Enter product id"
            value={productId}
            onChange={(e) => {
              setproductId(e.target.value);
            }}
            className="mx-4 w-[40vw] px-4 py-2 rounded-lg border border-grayColor focus:outline-none focus:border-blueColor"
          />
          <button
            type="submit"
            className="p-2 bg-blueColor w-fit rounded-lg mx-auto"
          >
            Find reviews
          </button>
        </form>

        {reviews?.map((review) => (
          <div
            key={review._id}
            className="p-2 border border-textAndBorder rounded-lg my-2"
          >
            <div className="flex justify-between">
              <div className="">
                <i className="fa-solid fa-user"></i> {review.user.name}
              </div>
              <div className="">
                <ReactStars
                  count={5} // number of stars
                  value={review.rating} // rating value
                  size={20} // star size
                  activeColor="red" // color of filled stars
                  color="#333" // color of empty stars
                  edit={false} // make it read-only
                />
              </div>
            </div>
            <div className="mt-2">
              <i className="fa-regular fa-comment-dots"></i> {review.comment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardReview;
