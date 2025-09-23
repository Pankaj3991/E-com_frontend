import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import banner from "../assets/2be6e572-5a78-4e45-b267-52a3c3e03f87-Photoroom.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../redux/reducers/categorySlice";
import { getAllProducts } from "../redux/reducers/productSlice";
import { useLocation } from 'react-router-dom'
import { errorMessage } from "../helperFunction";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setcategories] = useState([]);
  const [recentProducts, setrecentProducts] = useState([]);
  let { message} = location.state || {};
  const CategoryRef = useRef(null);

  useEffect(() => {
    if(message){errorMessage(message)};
    message = {};
    const fetchCategories = async () => {
      const response = await dispatch(getAllCategories());
      if (response?.payload?.success) {
        setcategories(response.payload.categories);
      }
      const productResponse = await dispatch(getAllProducts({}));
      if (productResponse?.payload?.success) {
        setrecentProducts(productResponse.payload.products);
      }
    };
    fetchCategories();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable auto slide
    autoplaySpeed: 3000, // Set the interval time (3 seconds),
  };

  return (
    <div className="mt-[7vh] min-h-[100vh] w-[100vw]">
      <div className="w[100vw] h-[93vh] relative mb-[5vh]">
        {/* <img src={banner} alt="" className="w-full h-full object-contain" /> */}
        <div className="flex flex-col pt-[10vh] pl-[20vw] bg-grayColor bg-opacity-70 absolute top-0 left-0 w-[100vw] h-[93vh]">
          <div className=" text-lg lg:text-xl font-bold my-[2vh]">Best</div>
          <div className="text-4xl md:text-7xl lg:text-9xl font-bebas my-[2vh]">
            Electronic items
          </div>
          <div className="text-3xl md:text-6xl lg:text-8xl font-bebas mx-auto my-[2vh]">
            & repairing service
          </div>
          <div className="flex gap-[5vw] my-[2vh] mt-auto">
            <button className="px-3 py-2 rounded-lg border border-grayColor cursor-pointer hover:shadow-lg bg-blueColor font-semibold" onClick={()=>{navigate('/listing')}}>
              Shop now
            </button>
            <button className="px-3 py-2 rounded-lg border border-grayColor cursor-pointer hover:shadow-lg bg-blueColor font-semibold" onClick={()=>{CategoryRef.current.scrollIntoView({ behavior: 'smooth'});}}>
              Explore categories
            </button>
          </div>
          <i className="fa-solid fa-arrow-down fa-bounce text-3xl border border-textAndBorder p-2 rounded-full w-fit mx-auto ml-[25vw] mt-auto mb-[10vh] my-[2vh]"></i>
        </div>
      </div>

      {/* Store features -- delivery, money back, support, secure payment, etc.  */}
      <div className="flex mb-[5vh] justify-evenly flex-wrap p-4">
        <div className="flex items-center w-10/12 md:w-1/3 lg:w-1/5 bg-orange-300 p-4 rounded-md m-[1vw]">
          <i className="fa-solid fa-truck-fast block text-3xl mr-3 p-2 rounded-full border border-textAndBorder "></i>
          <div className="flex flex-col">
            <div className="font-bold">Free Shipping</div>
            <div className="">On purchase over ₹500</div>
          </div>
        </div>

        <div className="flex items-center w-10/12 md:w-1/3 lg:w-1/5 bg-gray-300 p-4 rounded-md m-[1vw]">
          <i className="fa-solid fa-money-bill block text-3xl mr-3 p-2 rounded-full border border-textAndBorder "></i>
          <div className="flex flex-col">
            <div className="font-bold">Money back</div>
            <div className="">30 days back Guarantee</div>
          </div>
        </div>

        <div className="flex items-center w-10/12 md:w-1/3 lg:w-1/5 bg-green-300 p-4 rounded-md m-[1vw]">
          <i className="fa-solid fa-credit-card block text-3xl mr-3 p-2 rounded-full border border-textAndBorder"></i>
          <div className="flex flex-col">
            <div className="font-bold">Online support</div>
            <div className="">24/7 Technical support</div>
          </div>
        </div>

        <div className="flex items-center w-10/12 md:w-1/3 lg:w-1/5 bg-yellow-300 p-4 rounded-md m-[1vw]">
          <i className="fa-solid fa-money-bill block text-3xl mr-3 p-2 rounded-full border border-textAndBorder "></i>
          <div className="flex flex-col">
            <div className="font-bold">Secure payment</div>
            <div className="">All cards accepted</div>
          </div>
        </div>
      </div>

      <div className="text-2xl font-semibold mx-[5vw] mb-[5vh]" ref={CategoryRef}
      >
        Categories:
      </div>
      <div className="flex flex-wrap justify-center gap-[5vh] mb-[5vh]">
        {categories?.map((category) => (
          <div
            key={category._id}
            className="flex flex-col justify-center items-center p-5 w-[90vw] lg:w-[40vw] rounded-lg border border-grayColor hover:border-none hover:shadow-black hover:shadow-lg cursor-pointer bg-grayColor"
            onClick={()=>{navigate(`/category/${category._id}`)}}
          >
            <div className="text-xl font-semibold">{category.name}</div>
            <div className="ml-2">{category.description}</div>
            <button className="px-3 py-1 border border-grayColor bg-blueColor font-semibold rounded-lg mx-auto my-3">
              Shop by category
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center flex-col lg:flex-row bg-redColor text-whiteColor p-[5vw] mb-[5vh]">
        <div className="flex flex-col w-full lg:w-1/3 items-center">
          <p className="font-bold my-2">20% OFF</p>
          <div className="text-3xl md:text-4xl lg:text-7xl font-bebas tracking-wider">
            first{" "}
            <span className="text-3xl md:text-4xl lg:text-7xl font-bebas tracking-wide">
              SALE
            </span>
          </div>
          <div className="hidden text-2xl md:text-4xl lg:text-7xl font-bebas tracking-wide">
            sale
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-2/3 items-center justify-center">
          <div className="text-lg md:text-2xl lg:text-3xl my-3 font-bold tracking-wide">
            Get welcome gift <i className="fa-solid fa-gift"></i> of 20%{" "}
            <span className="lg:hidden">off on your first order</span>
          </div>
          <div className="hidden lg:block text-lg md:text-2xl lg:text-3xl my-3 font-bold tracking-wide">
            on your first order
          </div>
          <button className="px-3 py-1 bg-blueColor font-semibold rounded-lg w-fit my-3 hover:shadow-lg" onClick={()=>{CategoryRef.current.scrollIntoView({ behavior: 'smooth'});}}>
            Shop by category
          </button>
        </div>
      </div>
      <div className="text-2xl font-semibold mb-[5vh] mx-[5vw]">
        Latest products:{" "}
      </div>
      <div className="flex flex-wrap gap-[5vw] justify-evenly mb-[5vh]">
        {recentProducts?.map((product) => (
          <div
            key={product._id}
            className="flex flex-col w-[70vw] md:w-[40vw] lg:w-[25vw] border border-textAndBorder hover:shadow-black hover:shadow-lg cursor-pointer rounded-lg pb-4"
            onClick={()=>{navigate(`/product/${product._id}`)}}
          >
            <div className="w-full pt-4">
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
      <button className="px-3 py-2 border border-textAndBorder bg-blueColor hover:shadow-lg block rounded-lg w-fit mb-[5vh] mx-auto" onClick={()=>{navigate('/listing')}}>
          Explore more products
      </button>

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

export default Home;
