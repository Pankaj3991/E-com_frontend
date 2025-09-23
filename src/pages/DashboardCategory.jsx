import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import { useDispatch, useSelector } from "react-redux";
import { successMessage, errorMessage } from "../helperFunction.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../redux/reducers/categorySlice";
import Loader from "../components/Loader.jsx";

const DashboardCategory = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.category);
  const [categories, setcategories] = useState([]);
  const [createOpen, setcreateOpen] = useState(false);
  const [editOpen, seteditOpen] = useState(false);
  const [reload, setreload] = useState(false);
  const [createData, setcreateData] = useState({
    name: "",
    description: "",
  });
  useEffect(() => {
    // dispatch(getAllCategories({ setcategories }));
    const fetchCategories = async () =>{
      const response = await dispatch(getAllCategories());
      if(response?.payload?.success){
        setcategories(response.payload.categories);
      }
    }
    fetchCategories();
  }, [reload]);

  const createChange = (e) => {
    setcreateData({
      ...createData,
      [e.target.name]: e.target.value,
    });
  };
  const createSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      createCategory({ categoryData: createData })
    );
    if (response.payload.success) {
      successMessage(response.payload.message);
      setcreateOpen(false);
      setreload(!reload);
      setcreateData({ name: "", description: "" });
    } else {
      errorMessage(response.payload);
    }
  };

  if (isLoading) return <Loader />;
  if (error){console.log(error)}

  return (
    <div className="box-border min-h-[50vh] w-[100vw] bg-grayColor flex flex-col lg:flex-row mt-[7vh]">
      {/* create category form */}
      {createOpen && (
        <div className="fixed inset-0 w-[100vw] min-screen bg-textAndBorder bg-opacity-60 z-20 flex items-center justify-center overflow-auto">
          <div className="w-[90vw] md:w-[60vw] lg:w-[40vw] bg-whiteColor rounded-xl h-fit p-4 overflow-auto my-auto">
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
            <form onSubmit={createSubmit} className="my-4">
              <label htmlFor="name" className="block my-1">
                Category name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Category name"
                value={createData.name}
                onChange={createChange}
                className="mx-4 w-10/12 px-4 py-2 rounded-lg border border-textAndBorder focus:outline-none focus:border-blueColor"
              />

              <label htmlFor="description" className="block my-1">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={createData.description}
                onChange={createChange}
                rows="4"
                className="mx-4 my-1 p-3 block w-10/12 rounded-lg border border-grayColor shadow-sm focus:border-blueColor focus:ring-blueColor sm:text-sm"
                placeholder="Enter your message..."
              ></textarea>
              <button
                type="submit"
                className="p-2 my-2 bg-blueColor w-fit rounded-lg mx-auto"
              >
                Create category
              </button>
            </form>
          </div>
        </div>
      )}
      <DashboardSidebar />
      <div className="w-[100vw] min-h-[100vh] mt-24 lg:mt-0 lg:ml-[25vw] lg:w-[75vw] bg-whiteColor p-4">
        <h1 className="text-2xl font-bold mb-4">Category List</h1>
        <div
          className="text-xl mb-4 mx-auto border border-textAndBorder p-4 rounded-md w-fit cursor-pointer"
          onClick={() => {
            setcreateOpen(true);
          }}
        >
          <i className="fa-solid fa-circle-plus mr-2"></i>
          <span>Create Category</span>
        </div>

        {categories?.map((category) => (
          <div
            className="p-2 border border-textAndBorder rounded-lg my-2"
            key={category._id}
          >
            <div className="my-2 text-2xl font-bebas">{category.name}</div>
            <div className="my-2">{category.description}</div>
            <div
              className="py-2 px-4 bg-redColor rounded-lg w-fit"
              onClick={async () => {
                const response = await dispatch(
                  deleteCategory({ categoryId: category._id })
                );
                if (response.payload.success) {
                  successMessage(response.payload.message);
                  setreload(!reload);
                } else {
                  errorMessage(response.payload);
                }
              }}
            >
              Delete
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCategory;
