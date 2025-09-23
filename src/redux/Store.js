import { configureStore } from '@reduxjs/toolkit';
import productReducer from "./reducers/productSlice";
import userReducer from "./reducers/userSlice";
import categoryReducer from "./reducers/categorySlice";
import reviewReducer from "./reducers/reviewSlice";
import cartReducer from "./reducers/cartSlice"; 
import orderReducer from "./reducers/orderSlice"; 

export const store = configureStore({
    reducer:{
        product: productReducer,
        user: userReducer,
        category: categoryReducer,
        review: reviewReducer,
        cart: cartReducer,
        order: orderReducer,
    }
});

export default store;