import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
  description: String,
  startDate: Date,
  completedDate: Date,
  updates: [
    {
      message: String,
      date: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
