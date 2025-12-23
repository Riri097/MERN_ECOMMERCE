import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js'; // We created this earlier
import sendEmail from '../utils/sendEmail.js';

// to generate 6 digit OTP
//sends otp for email, hashedotp for database
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

  // for new user
  // creates random value called salt and 10 is strength level
  // if two users have same pass salt makes them different 
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
    emailOTPExpire: { $gt: Date.now() }, // Check if not expired
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

  // Log them in immediately
  generateToken(res, user._id);

  res.json({
    message: 'Email verified successfully',
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// Login User
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
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export { registerUser, verifyEmail, authUser };