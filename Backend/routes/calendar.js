import express from 'express';
import AppointmentRequest from '../models/AppointmentRequest.js';
import { createCalendarEventCustom } from '../utils/googleCalendar.js';

const router = express.Router();

// POST /api/calendar/create
router.post('/create', async (req, res) => {
  try {
    const { appointmentId, selectedDateTime, duration } = req.body;

    if (!appointmentId || !selectedDateTime || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch the appointment
    const appointment = await AppointmentRequest.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update appointment date and status
    appointment.date = new Date(selectedDateTime); // force it into a proper Date object
    appointment.status = 'scheduled';
    await appointment.save();

    // Create calendar event
    await createCalendarEventCustom(appointment, duration);

    res.status(200).json({ message: 'Appointment scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
