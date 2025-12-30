import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

//Create new order
const createOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || user.cartItems.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  // 1. Create order items from cart
  const orderItems = user.cartItems.map((item) => ({
    name: item.name,
    qty: item.qty,
    image: item.image,
    price: item.price,
    product: item.product,
  }));

  // 2. Create order
  const order = new Order({
    user: user._id,
    orderItems,
    shippingAddress: user.shippingAddress || "Not provided",
    paymentMethod: "Fake Payment",
    totalPrice: orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    ),
  });

  // 3. Reduce product stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product || product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Not enough stock for ${item.name}`);
    }

    product.countInStock -= item.qty;
    await product.save();
  }

  // 4. Save order
  const createdOrder = await order.save();

  // 5. Clear user cart
  user.cartItems = [];
  await user.save();

  res.status(201).json(createdOrder);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});
export { createOrder, getMyOrders };
