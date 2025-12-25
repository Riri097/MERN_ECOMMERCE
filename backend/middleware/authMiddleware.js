import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

//Protect Middleware: Checks if user is logged in
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Decode the token to get the User ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find the user in DB (exclude password) and attach to req.user
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

//Admin Middleware: Checks if the logged-in user is an Admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is Admin, proceed
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };