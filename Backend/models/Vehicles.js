import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  make: String,
  model: String,
  color: String, 
  year: Number,
  vin: String,
  notes: String,
  licensePlate: String,
}, {
  timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
