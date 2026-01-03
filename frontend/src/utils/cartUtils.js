export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // 1. Calculate Items Price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // 2. Calculate Shipping Price
  // If items price > 100, shipping is free, otherwise $10
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // 3. Calculate Tax Price (15%)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  // 4. Calculate Total Price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // 5. Save to LocalStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};