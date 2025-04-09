import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
  description: String,
  updates: [
    {
      message: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
