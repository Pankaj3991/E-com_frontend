import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="mt-[7vh] min-h-[100vh] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <p className="text-2xl md:text-3xl font-medium mt-4">
          Oops! Page not found.
        </p>
        <p className="mt-4 text-gray-500">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
        <Link to="/">
          <button className="mt-6 px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-md">
            Go back home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
