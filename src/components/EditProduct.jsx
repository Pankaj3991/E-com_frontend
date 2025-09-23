import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { updateProduct } from "../redux/reducers/productSlice";
import { successMessage, errorMessage } from "../helperFunction.js";

const EditProduct = ({ productData, setupdateOpen, reload, setreload }) => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.product);
  const [productImages, setproductImages] = useState(productData.images);
  const [editData, seteditData] = useState({
    name: productData.name,
    description: productData.description,
    images: productData.images,
    price: productData.price,
    stock: productData.stock,
  });
  const [imagesToDelete, setimagesToDelete] = useState([]); //public_id
  const [newImages, setnewImages] = useState([]);
  const handleEditChange = (e) => {
    seteditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("description", editData.description);
    imagesToDelete.forEach((public_id) => {
      formData.append("RemoveImages[]", public_id);
    });
    newImages.forEach((file) => {
      formData.append("newImages", file); // The key 'images' matches the backend field name
    });
    formData.append("price", editData.price);
    formData.append("stock", editData.stock);

    const response = await dispatch(
      updateProduct({ formData, productId: productData._id })
    );
    if (response?.payload?.success) {
      successMessage(response.payload.message);
    } else {
      errorMessage(response.payload);
    }
    setreload(!reload);
    setupdateOpen(false);
  };

  if (isLoading) return <Loader />;
  if (error) {
    console.log(error);
  }

  return (
    <div className="fixed inset-0 w-[100vw] h-[100vh] bg-textAndBorder bg-opacity-60 z-20 flex items-center justify-center overflow-auto">
      <div className="w-[90vw] md:w-[80vw] lg:w-[70vw] h-[100vh] bg-whiteColor overflow-auto px-[5vw] py-[5vh]">
        <div className="flex justify-between mb-4">
          <p className="text-xl font-semibold border border-textAndBorder rounded-lg w-fit p-2">
            Update product
          </p>
          <i
            className="fa-solid fa-xmark text-3xl border border-textAndBorder px-2 pt-1 rounded-full cursor-pointer"
            onClick={() => {
              setupdateOpen(false);
            }}
          ></i>
        </div>
        <div>
          <form onSubmit={handleEditSubmit}>
            <label htmlFor="name" className="block mb-1 font-semibold">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editData.name}
              required
              onChange={handleEditChange}
              className="w-full px-4 py-1 rounded border border-gray-400 focus:outline-none focus:border-blue-400"
            />

            <label htmlFor="description" className="block mb-1 font-semibold">
              Description:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={editData.description}
              required
              onChange={handleEditChange}
              className="w-full px-4 py-1 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
            />

            {editData.images.length > 0 && (
              <div className="flex my-2 flex-wrap gap-6 w-full justify-center">
                {editData.images.map((image, index) => (
                  <div className="relative w-1/4" key={index}>
                    <img
                      src={image.url} // Assuming the image URL is returned in `image.url`
                      alt={`Slide ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                    <span
                      className="absolute top-0 right-0 cursor-pointer border rounded-lg lg:py-1 lg:px-2 bg-whiteColor"
                      onClick={() => {
                        seteditData((previous) => ({
                          ...previous,
                          images: previous.images.filter((_, i) => i !== index),
                        }));
                        setimagesToDelete((previous) => [
                          ...previous,
                          image.public_id,
                        ]);
                      }}
                    >
                      x
                    </span>
                  </div>
                ))}
              </div>
            )}
            <label className="block mb-2 font-semibold" htmlFor="images">
              Add new Images:
            </label>
            <input
              type="file"
              accept="image/*"
              id="images"
              name="images"
              multiple
              onChange={(e) => {
                setnewImages([...newImages, ...e.target.files]);
              }}
              className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
            />
            {editData.images.length + newImages.length > 5 && (
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
              value={editData.price}
              required
              onChange={handleEditChange}
              className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
            />

            <label htmlFor="stock" className="block mb-2 font-semibold">
              Stock:
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={editData.stock}
              min={1}
              required
              onChange={handleEditChange}
              className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={editData.images.length + newImages.length > 5}
              className={`${
                editData.images.length + newImages.length > 5
                  ? "bg-redColor"
                  : "bg-blueColor"
              } w-full py-2 px-4 mt-4 text-whiteColor rounded-md focus:outline-none`}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
