import mongoose from 'mongoose';

const appointmentRequestSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle' // 🔥 properly reference Vehicle collection
  },
  customerId: {        // 🔥 ADD THIS FIELD!
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'        // 🔥 it connects to User collection
  },
  reason: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const AppointmentRequest = mongoose.model('AppointmentRequest', appointmentRequestSchema);

export default AppointmentRequest;