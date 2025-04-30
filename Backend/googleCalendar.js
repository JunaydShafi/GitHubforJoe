import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the directory name from the file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account credentials
const credentials = JSON.parse(readFileSync(path.join(__dirname, 'config', 'calendar-access.json')));

// Set up Google Calendar API client with service account
const calendar = google.calendar('v3');
const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar'],  // Full access to Google Calendar
});

// Function to create an appointment event on Google Calendar
const createCalendarEvent = async (appointmentDateTime, reason, firstName, lastName, email) => {
  try {
    if (!email) {
      throw new Error("Attendee email is missing.");
    }

    const calendarEvent = {
      summary: `Appointment for ${firstName} ${lastName}`,
      location: 'Joe\'s AutoShop',
      description: reason,
      start: {
        dateTime: new Date(appointmentDateTime),  // Ensure this is correct
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(new Date(appointmentDateTime).getTime() + 60 * 60 * 1000), // Assuming 1-hour appointment
        timeZone: 'America/Los_Angeles',
      },
      attendees: [{ email: email }],  // Add customer's email as an attendee
    };

    // Insert the event into Google Calendar
    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',  // Use 'primary' to access your Google account's primary calendar
      resource: calendarEvent,
    });

    console.log('Google Calendar event created:', response.data);
    return { success: true, message: 'Appointment confirmed and added to Google Calendar!' };
  } catch (error) {
    console.error('Error adding to Google Calendar:', error);
    return { success: false, message: `Error adding event to Google Calendar: ${error.message || error}` };
  }
};

// Export auth, calendar, and createCalendarEvent
export { auth, calendar, createCalendarEvent };
