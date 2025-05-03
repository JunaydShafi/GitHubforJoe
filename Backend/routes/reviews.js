import express from 'express';
import Review from '../models/review.js';
import AppointmentRequest from '../models/AppointmentRequest.js';

const reviewRoutes = express.Router();

// POST: Submit review
reviewRoutes.post('/', async (req, res) => {
  try {
    const { jobId, mechanicId, customerId, stars, comment } = req.body;
    console.log('Incoming review:', req.body);

    if (!stars || !mechanicId || !customerId || !jobId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newReview = new Review({
      jobId,
      mechanicId,
      customerId,
      stars,
      comment,
      createdAt: new Date()
    });

    await newReview.save();
    res.status(201).json({ message: 'Review submitted' });
  } catch (err) {
    console.error('❌ Error saving review:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET: Fetch all reviews
reviewRoutes.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'jobId',
        populate: { path: 'vehicleId mechanicId', select: 'make model year username email' }
      })
      .populate('mechanicId', 'username email')
      .populate('customerId', 'username email');

    const enrichedReviews = await Promise.all(reviews.map(async r => {
      const appointment = await AppointmentRequest.findOne({
        customerId: r.customerId?._id || r.customerId,
        vehicleId: r.jobId?.vehicleId?._id
      });

      const customerName = appointment ? `${appointment.firstName} ${appointment.lastName}` : 'Unknown';

      return {
        ...r.toObject(),
        customerName
      };
    }));

    res.json(enrichedReviews);
  } catch (err) {
    console.error('❌ Error fetching reviews:', err);
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
});

export default reviewRoutes;