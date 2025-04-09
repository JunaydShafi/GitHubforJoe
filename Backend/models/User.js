import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['customer', 'mechanic', 'manager'], default: 'customer' }
});

const User = mongoose.model('User', userSchema);
export default User;
