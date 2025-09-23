import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { clearError, getAllProducts } from "../redux/reducers/productSlice";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CategoryFilter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { data, isLoading, error } = useSelector((state) => state.product);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    dispatch(clearError());
    const getProducts = async () => {
      const response = await dispatch(
        getAllProducts({
          category: categoryId,
          page: currentPage,
        })
      );
      console.log(response.payload);
      if (response?.payload?.success) {
        await setProducts(response.payload.products);
        await setTotalPages(response.payload.totalPages);
      }
    };
    getProducts();
    console.log(products);
  }, [currentPage, categoryId]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable auto slide
    autoplaySpeed: 3000, // Set the interval time (3 seconds)
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) return <Loader />;
  if (error){console.log(error)}

  return (
    <div className="mt-[7vh] min-h-[100vh]">
      {products.length == 0 && (
        <div className="w-[100vw] h-[90vh] flex flex-col justify-center items-center">
          <div className="text-xl">No product found related to {categoryId}</div>
          <i className="fa-regular fa-face-sad-tear block text-4xl"></i>
        </div>
      )}
      <div className="flex flex-wrap gap-[5vw] justify-evenly mb-[5vh] pt-[5vh]">
        {products?.map((product) => (
          <div
            key={product._id}
            className="flex flex-col w-[70vw] md:w-[40vw] lg:w-[25vw] border border-grayColor hover:shadow-textAndBorder hover:shadow-lg cursor-pointer rounded-lg pb-5"
            onClick={() => {
              navigate(`/product/${product._id}`);
            }}
          >
            <div className="w-full">
              {product.images.length > 1 ? (
                <Slider {...settings}>
                  {product.images.map((image, index) => (
                    <div key={index} className="slide">
                      <img
                        src={image.url} // Assuming the image URL is returned in `image.url`
                        alt={`Slide ${index + 1}`}
                        className="w-auto h-60 rounded-lg mx-auto"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <img src={product.images[0].url} alt="" className="w-auto h-60 rounded-lg mx-auto"/>
              )}
            </div>
            <div className="flex flex-col mt-10 items-center mb-[5vh]">
              <div className="text-xl text-center">{product.name}</div>
              <div className="">₹ {product.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mb-[5vh]">
        <button
          className="px-3 py-1 mx-1 bg-grayColor hover:shadow-md rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-3 py-1 mx-1">
          {currentPage} / {totalPages}
        </span>
        <button
          className="px-3 py-1 mx-1 bg-grayColor hover:shadow-md rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {/* Tailwind CSS customization for arrows of Slider */}
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
        `}
      </style>
    </div>
  );
};

export default CategoryFilter;
