import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler'; 
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// Generate 6 digit OTP
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  return { otp, hashedOTP };
};

// Register User & Send OTP
const registerUser = asyncHandler( async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('All fields required');
  }

  const existingUser = await User.findOne({ email });

  // User already exists and is verified
  if (existingUser && existingUser.isVerified) {
    res.status(400);
    throw new Error('User already exists');
  }

  // User exists but NOT verified (Resend OTP)
  if (existingUser && !existingUser.isVerified) {
    const { otp, hashedOTP } = generateOTP();
    
    existingUser.emailOTP = hashedOTP;
    existingUser.emailOTPExpire = Date.now() + 10 * 60 * 1000;
    await existingUser.save();

    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Your OTP is:</p><h2>${otp}</h2><p>Expires in 10 minutes</p>`,
    });

    return res.json({ message: 'OTP resent to email', success: true });
  }

  // New User Logic
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const { otp, hashedOTP } = generateOTP();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    emailOTP: hashedOTP,
    emailOTPExpire: Date.now() + 10 * 60 * 1000,
    isVerified: false,
    role: 'user', // Default role
    isAdmin: false // Default admin status
  });

  if (user) {
    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      html: `<p>Your OTP is:</p><h2>${otp}</h2><p>Expires in 10 minutes</p>`,
    });

    res.status(201).json({
      message: 'OTP sent to email',
      success: true,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Verify OTP
const verifyEmail = asyncHandler( async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    res.status(400);
    throw new Error('Email and OTP required');
  }

  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    email,
    emailOTP: hashedOTP,
    emailOTPExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  // Verify User
  user.isVerified = true;
  user.emailOTP = undefined;
  user.emailOTPExpire = undefined;
  await user.save();

  generateToken(res, user._id);

  res.json({
    message: 'Email verified successfully',
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin,
  });
});

// Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler( async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error('Email not verified. Please check your email.');
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin', // Helper for frontend
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

//Logout user / clear cookie
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.role === 'admin',
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update user profile (Self Update)
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isAdmin: updatedUser.role === 'admin',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { email: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const count = await User.countDocuments({ ...keyword });
  const users = await User.find({ ...keyword })
    .select('-password') 
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update user (Admin)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    // Sync isAdmin and role to avoid bugs
    if (req.body.isAdmin !== undefined) {
        user.isAdmin = Boolean(req.body.isAdmin);
        user.role = user.isAdmin ? 'admin' : 'user';
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { 
  registerUser, 
  verifyEmail, 
  authUser, 
  logoutUser, 
  getUserProfile, 
  updateUserProfile, 
  getUsers, 
  deleteUser, 
  getUserById, 
  updateUser 
};