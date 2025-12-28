import { createSlice } from '@reduxjs/toolkit';

// Helper to update localStorage
const updateCart = (state) => {
  state.itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  localStorage.setItem('cart', JSON.stringify(state));
};

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;