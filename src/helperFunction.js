import { toast } from "react-toastify";

const toastOptions = {
  position: "bottom-center",
  autoClose: 3000, // 3 seconds
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};
export const successMessage = (message) => {
  toast.success(message, toastOptions);
};

export const errorMessage = (message) => {
  toast.error(message, toastOptions);
};
