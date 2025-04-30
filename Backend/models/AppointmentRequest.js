import mongoose from 'mongoose';

const appointmentRequestSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  vehicleId: {
    type: String,
    default: 'placeholder-vehicle-id', // Default value if vehicleId is not provided
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
});

const AppointmentRequest = mongoose.model('AppointmentRequest', appointmentRequestSchema);

export default AppointmentRequest;

//tes