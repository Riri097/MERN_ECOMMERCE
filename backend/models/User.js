import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const cartItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const userSchema = mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    
    isVerified: { type: Boolean, default: false },
    emailOTP: { type: String },
    emailOTPExpire: { type: Date },

    cartItems: [cartItemSchema], 
}, {
    timestamps: true,
});

// function to check users entered pass with their saved pass
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;