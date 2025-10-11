import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Profile from "./pages/Profile.jsx";
import DashboardProduct from "./pages/DashboardProduct.jsx";
import DashboardCategory from "./pages/DashboardCategory.jsx";
import DashboardUser from "./pages/DashboardUser.jsx";
import DashboardReview from "./pages/DashboardReview.jsx";
import DashboardOrder from "./pages/DashboardOrder.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Listing from "./pages/Listing.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import SearchProduct from "./pages/SearchProduct.jsx";
import CategoryFilter from "./pages/CategoryFilter.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import AdminRoute from "./utils/AdminRoute.jsx";
import SupplierAdmin from "./utils/SupplierAdmin.jsx";
const App = () => {
  return (
    <BrowserRouter>
      {/* fixed component/pages for every page -- like header */}
      <Header />
      <ToastContainer className="z-99" />
      <Routes>
        {/* Generate routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:productId" element={<ProductDetail />} />

        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/dashboard/category" element={<DashboardCategory />} />
          <Route path="/dashboard/users" element={<DashboardUser />} />
          <Route path="/dashboard/reviews" element={<DashboardReview />} />

        </Route>
        <Route element={<SupplierAdmin />}>
          <Route path="/dashboard/products" element={<DashboardProduct />} />
          <Route path="/dashboard/orders" element={<DashboardOrder />} />
        </Route>
        <Route path="/listing" element={<Listing />} />
        <Route path="/search/:keyword" element={<SearchProduct />} />
        <Route path="/category/:categoryId" element={<CategoryFilter />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
