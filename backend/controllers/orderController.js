import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
// User import is not strictly needed if we trust req.user from middleware

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  // 1. Get data from Frontend Request Body
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // 2. Create the Order Object
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id || x.product, // Ensure ID is correct
        _id: undefined, // Don't save the cart item ID, let Mongo generate a new one
      })),
      user: req.user._id,
      shippingAddress, // Uses the address sent from Frontend
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // 3. Save Order
    const createdOrder = await order.save();

    // 4. (Optional) Reduce Stock Logic
    // You can keep your stock reduction logic here if you want, 
    // but make sure it loops through the 'orderItems' from the body, not user.cartItems.
    for (const item of orderItems) {
      const product = await Product.findById(item.product || item._id);
      if (product) {
        product.countInStock = product.countInStock - item.qty;
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  }
});

// ... keep getMyOrders and others ...
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// You also need this for the OrderScreen to work!
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { createOrder, getMyOrders, getOrderById };