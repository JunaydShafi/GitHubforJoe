import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ['customer', 'employee', 'admin'], // ✅ all valid roles included
    default: 'customer'
  }
}, {
  timestamps: true // ✅ belongs here, inside the second argument to Schema
});

const User = mongoose.model('User', userSchema);
export default User;
