import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  make: String,
  model: String,
  year: Number,
  licensePlate: String
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
