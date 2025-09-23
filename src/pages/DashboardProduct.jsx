import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { successMessage, errorMessage } from "../helperFunction.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  getAllProducts,
  clearError,
  createProduct,
  deleteProduct,
} from "../redux/reducers/productSlice.js";
import { getAllCategories } from "../redux/reducers/categorySlice.js";
import Loader from "../components/Loader.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import EditProduct from "../components/EditProduct.jsx";
import { currentUser } from "../redux/reducers/userSlice.js";

const DashboardProduct = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.product);
  const { currentuser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openProductId, setOpenProductId] = useState(null);

  // create a product
  const [createOpen, setcreateOpen] = useState(false);
  const [productData, setproductData] = useState({
    name: "",
    description: "",
    images: "",
    price: 0,
    category: "",
    stock: 0,
  });
  const [reload, setreload] = useState(false);
  const [allCategories, setallCategories] = useState([]);
  const [updateOpen, setupdateOpen] = useState(false);
  const [productToUpdate, setproductToUpdate] = useState("");
  // Fetch product data with pagination
  useEffect(() => {
    const getProducts = async () => {
      const response = await dispatch(
        getAllProducts({
          page: currentPage,
          role: currentuser.role === "supplier",
        })
      );
      if (response?.payload?.success) {
        setProducts(response.payload.products);
        setTotalPages(response.payload.totalPages);
      }
    };
    getProducts();
  }, [currentPage, reload]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable auto slide
    autoplaySpeed: 3000, // Set the interval time (3 seconds)
  };

  // Handle collapsible product details
  const toggleProductDetails = (id) => {
    setOpenProductId(openProductId === id ? null : id);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // create product
  const [hasRun, sethasRun] = useState(false);
  if (!hasRun) {
    const fetchCategory = async () => {
      sethasRun(true);
      const response = await dispatch(getAllCategories({ setallCategories }));
      if (response?.payload?.success) {
        const ct = response.payload.categories.map((cate) => cate.name);
        setallCategories((previous) => [...previous, ...ct]);
      }
    };
    fetchCategory();
  }
  const handlecreateChange = (e) => {
    setproductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    productData.images.forEach((file) => {
      formData.append("images", file); // The key 'images' matches the backend field name
    });
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("stock", productData.stock);
    const response = await dispatch(createProduct({ formData }));
    if (response?.payload?.success) {
      successMessage(`${response.payload.message}`);
    } else {
      errorMessage(`${response.payload}`);
    }
    setreload(!reload);
    setcreateOpen(false);
    setproductData({
      name: "",
      description: "",
      images: "",
      price: 0,
      category: "",
      stock: 0,
    });
  };
  if (isLoading) return <Loader />;
  if (error) {
    console.log(error);
  }

  return (
    <div className="box-border min-h-[50vh] w-[100vw] flex flex-col lg:flex-row mt-[7vh]">
      {/* create product form */}
      {updateOpen && (
        <EditProduct
          productData={productToUpdate}
          setupdateOpen={setupdateOpen}
          reload={reload}
          setreload={setreload}
        />
      )}
      {createOpen && (
        <div className="fixed inset-0 w-[100vw] h-[100vh] bg-textAndBorder bg-opacity-60 z-20 flex items-center justify-center overflow-auto">
          <div className="w-[90vw] md:w-[60vw] lg:w-[40vw] bg-whiteColor rounded-xl h-fit overflow-auto px-[5vw] py-[5vh]">
            <div className="flex justify-between mb-2">
              <p className="text-xl font-semibold border-2 border-textAndBorder rounded-lg w-fit p-2">
                Create product
              </p>
              <i
                className="fa-solid fa-xmark text-3xl border-2 border-textAndBorder px-2 pt-1 rounded-full cursor-pointer"
                onClick={() => {
                  setcreateOpen(false);
                }}
              ></i>
            </div>
            <div className="">
              <form onSubmit={handleCreateSubmit}>
                <label htmlFor="name" className="block mb-2 font-semibold">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productData.name}
                  required
                  onChange={handlecreateChange}
                  className="w-full px-4 py-2 rounded border border-grayColor focus:outline-none focus:border-blueColor"
                />

                <label
                  htmlFor="description"
                  className="block mb-2 font-semibold"
                >
                  Description:
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={productData.description}
                  required
                  onChange={handlecreateChange}
                  className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
                />

                <label className="block mb-2 font-semibold" htmlFor="images">
                  Product Images:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="images"
                  name="images"
                  multiple
                  required
                  onChange={(e) => {
                    setproductData((previousState) => ({
                      ...previousState,
                      images: [...e.target.files],
                    }));
                  }}
                  className="w-full px-4 py-2 rounded border border-grayColor focus:outline-none focus:border-blueColor"
                />
                {productData.images.length > 5 && (
                  <p className="text-redColor">
                    Please select maximum 5 images only
                  </p>
                )}

                <label htmlFor="price" className="block mb-2 font-semibold">
                  Price:
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min={1}
                  value={productData.price}
                  required
                  onChange={handlecreateChange}
                  className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
                />

                <div className="w-full my-2">
                  <label
                    htmlFor="category"
                    className="block mb-2 font-semibold"
                  >
                    Category:
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="block w-full border text-center cursor-pointer py-2 border-textAndBorder rounded-lg bg-whiteColor text-textAndBorder focus:ring-2 focus:ring-blueColor focus:outline-none"
                    value={productData.category}
                    onChange={handlecreateChange}
                  >
                    <option value="" disabled>
                      Choose a category
                    </option>
                    {allCategories?.map((cate, index) => (
                      <option key={index} value={cate}>
                        {cate}
                      </option>
                    ))}
                  </select>
                </div>

                <label htmlFor="stock" className="block mb-2 font-semibold">
                  Stock:
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={productData.stock}
                  min={1}
                  required
                  onChange={handlecreateChange}
                  className="w-full px-4 py-2 rounded border border-grayColor focus:outline-none focus:border-blueColor"
                />
                <button
                  type="submit"
                  disabled={productData.images.length > 5}
                  className={`${
                    productData.images.length > 5 ? "bg-redColor" : "bg-blueColor"
                  } w-full py-2 px-4 mt-4 font-bold text-whiteColor rounded-md hover:shadow-lg focus:outline-none`}
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* sidebar */}
      <DashboardSidebar />
      {/* actual content */}
      <div className="w-[100vw] min-h-[100vh] mt-24 lg:mt-0 lg:ml-[25vw] lg:w-[75vw] bg-whiteColor lg:p-4">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Product List</h1>
          <div
            className="text-xl mb-4 mx-auto border border-textAndBorder p-4 rounded-md w-fit cursor-pointer"
            onClick={() => {
              setcreateOpen(true);
            }}
          >
            <i className="fa-solid fa-circle-plus mr-2"></i>
            <span>Create product</span>
          </div>

          {products?.map((product) => (
            <div
              key={product._id}
              className="mb-4 border border-textAndBorder rounded-lg p-1"
            >
              <div
                className="flex justify-between p-4 cursor-pointer bg-grayColor hover:shadow-md rounded-lg"
                onClick={() => toggleProductDetails(product._id)}
              >
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <span>{openProductId === product._id ? "-" : "+"}</span>
              </div>

              {openProductId === product._id && (
                <div className="flex flex-col w-full lg:flex-row">
                  {/* images */}
                  <div className="lg:w-1/4 py-4">
                    {product.images.length > 1 ? (
                      <Slider {...settings}>
                        {product.images.map((image, index) => (
                          <div key={index} className="slide">
                            <img
                              src={image.url} // Assuming the image URL is returned in `image.url`
                              alt={`Slide ${index + 1}`}
                              className="w-auto h-40 rounded-lg mx-auto"
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <img src={product.images[0].url} alt="" className="w-auto h-40 rounded-lg mx-auto"/>
                    )}
                  </div>
                  {/* product details */}
                  <div className="p-4 bg-whiteColor lg:w-3/4">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bebas">
                      {product.name}
                    </div>
                    <div className="">
                      <span className=" text-lg font-bold">Product id: </span>
                      <span>{product._id}</span>
                    </div>
                    <div className="flex my-4">
                      <div className="mr-auto">₹ {product.price}</div>
                      <div className="text-lg mr-auto">
                        <span className="text-lg font-semibold">Stock: </span>
                        {product.stock > 0 ? (
                          <span className="">{product.stock}</span>
                        ) : (
                          <span className="text-redColor">Out of stock</span>
                        )}
                      </div>
                    </div>
                    <div className="my-2">
                      <span className="text-lg font-semibold">
                        About this product:{" "}
                      </span>
                      {product.description}
                    </div>
                    <div className="flex mt-4">
                      <div
                        className="border p-2 rounded-lg mr-auto bg-blueColor cursor-pointer"
                        onClick={() => {
                          setupdateOpen(true);
                          setproductToUpdate(product);
                        }}
                      >
                        Edit product
                      </div>
                      <div
                        className="border p-2 rounded-lg mr-auto bg-redColor cursor-pointer"
                        onClick={async () => {
                          const response = await dispatch(
                            deleteProduct({ productId: product._id })
                          );
                          if (response?.payload?.success) {
                            successMessage(response.payload.message);
                          } else {
                            errorMessage(response.payload);
                          }
                          setreload(!reload);
                        }}
                      >
                        Delete product
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              className="px-3 py-1 mx-1 bg-grayColor hover:shadow-lg rounded cursor-pointer"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-3 py-1 mx-1">
              {currentPage} / {totalPages}
            </span>
            <button
              className="px-3 py-1 mx-1 bg-grayColor hover:shadow-lg rounded cursor-pointer"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
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

export default DashboardProduct;
