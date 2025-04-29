import express from 'express';
import AppointmentRequest from '../models/AppointmentRequest.js';

const router = express.Router();

// GET all pending appointments
router.get('/pending', async (req, res) => {
  try {
    const appointments = await AppointmentRequest.find({ status: 'pending' });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH - Update status to 'selected' when admin clicks "Proceed to Schedule"
router.patch('/:id/select', async (req, res) => {
  try {
    const appointment = await AppointmentRequest.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'selected'; // temporary flag to show it's being scheduled
    await appointment.save();

    res.json({ message: 'Appointment selected for scheduling' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Deny appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await AppointmentRequest.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
