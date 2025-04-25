import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  resetOtp: String,
  otpExpires: Date,
  canReset: Boolean,

  payroll: {
    minutes: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    rate: { type: Number, default: 20 } // or whatever base rate you want
  },

  role: {
    type: String,
    enum: ['customer', 'employee', 'admin'],
    default: 'customer'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
