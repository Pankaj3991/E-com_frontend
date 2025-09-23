import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [menuOpen, setmenuOpen] = useState(false);
  const handleSearch = async (e) => {
    e.preventDefault();
    setmenuOpen(false);
    navigate(`/search/${search}`);
    setsearch();
  };
  return (
    <div className="fixed top-0 left-0 w-[100vw] max-h-[20vh] h-[7vh] bg-grayColor border border-textAndBorder z-20 py-1">
      <div className="flex">
        <button className="mx-auto text-2xl md:text-3xl lg:text-4xl font-bebas italic tracking-wider cursor-pointer" onClick={()=> navigate('/')}>
          ElectroDeals
        </button>

        <i
          className="mr-[5vw] fa-solid fa-bars text-xl lg:hidden inline-block"
          onClick={() => {
            setmenuOpen(!menuOpen);
          }}
        ></i>
        <div className="hidden lg:inline-block ">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              placeholder="search"
              onChange={(e) => {
                setsearch(e.target.value);
              }}
              className={`text-center w-[30vw] px-2 py-1 rounded rounded-r-none border border-grayColor focus:outline-none focus:border-blueColor`}
            />
            <button
              type="submit"
              className="border border-grayColor bg-blueColor  rounded rounded-l-none h-fit py-1 px-2"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
        <div className="hidden lg:flex ml-auto mr-10">
          <div className="mx-3 cursor-pointer" onClick={()=> navigate('/listing')}>
            <i className="fa-solid fa-store block text-xl px-2"></i>
          </div>
          <div className="mx-3 cursor-pointer" onClick={()=> navigate('/profile')}>
            <i className="fa-regular fa-user text-xl px-2"></i>
          </div>
          <div className="mx-3 cursor-pointer" onClick={()=> navigate('/cart')}>
            <i className="fa-solid fa-cart-shopping text-xl px-2"></i>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-grayColor">
          <div className="flex justify-evenly my-2">
            <div className="mx-3">
              <i
                className="fa-solid fa-store block text-xl px-2"
                onClick={() => {
                  navigate('/listing');
                  setmenuOpen(false);
                }}
              ></i>
            </div>
            <div className="mx-3">
              <i
                className="fa-regular fa-user text-xl px-2"
                onClick={() => {
                  navigate('/profile');
                  setmenuOpen(false);
                }}
              ></i>
            </div>
            <div className="mx-3">
              <i
                className="fa-solid fa-cart-shopping text-xl px-2"
                onClick={() => {
                  navigate('/cart');
                  setmenuOpen(false);
                }}
              ></i>
            </div>
          </div>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              placeholder="search"
              onChange={(e) => {
                setsearch(e.target.value);
              }}
              className={`text-center ml-[5vw] my-2 w-[70vw] px-2 py-1 rounded rounded-r-none border border-grayColor focus:outline-none focus:border-blueColor`}
            />
            <button
              type="submit"
              className="border border-grayColor bg-blueColor  rounded rounded-l-none h-fit py-1 px-2"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Header;
