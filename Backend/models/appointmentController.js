import AppointmentRequest from './models/AppointmentRequest'; // Import the model
import { createCalendarEvent } from './googleCalendar'; // Import the Google Calendar event creation function

// Function to handle the process of fetching the appointment and creating the event
const handleCreateEventFromAppointment = async (appointmentId) => {
  try {
    // Step 1: Fetch appointment data from MongoDB using the appointment ID
    const appointment = await AppointmentRequest.findById(appointmentId);

    // Step 2: If the appointment is not found, return an error
    if (!appointment) {
      console.error('Appointment not found!');
      return { success: false, message: 'Appointment not found!' };
    }

    // Step 3: Extract the data needed for the calendar event
    const { date, reason, firstName, lastName, email, phone, vehicleId } = appointment;

    // Step 4: Call the createCalendarEvent function to create the Google Calendar event
    const result = await createCalendarEvent(
      date,         // Date of the appointment (from the database)
      reason,       // Reason for the appointment (from the database)
      firstName,    // Customer's first name
      lastName,     // Customer's last name
      email,        // Customer's email
      phone,        // Customer's phone
      vehicleId     // Customer's vehicle ID
    );

    // Return the result of the event creation
    return result;
  } catch (error) {
    console.error('Error handling appointment:', error);
    return { success: false, message: 'Error fetching appointment data.' };
  }
};

// Example Usage
// Calling this function with an appointment ID (replace with an actual appointment ID from your database)
handleCreateEventFromAppointment('681186a5b078da8a56b71f4f4')
  .then(response => {
    if (response.success) {
      console.log('Event successfully created on Google Calendar!');
    } else {
      console.error('Error creating event:', response.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
