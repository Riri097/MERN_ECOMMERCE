import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    isAdmin : {type: Boolean, required: true, default: false },

    isVerified: { type: Boolean, default: false },
    emailOTP: { type: String },
    emailOTPExpire: { type: Date },
}, {
    timestamps: true,
});

// function to check users entered pass with their saved pass
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;