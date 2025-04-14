import mongoose from 'mongoose';

const appointmentRequestSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  vehicleId: String,
  reason: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  }
});

const AppointmentRequest = mongoose.model('AppointmentRequest', appointmentRequestSchema);

export default AppointmentRequest;
