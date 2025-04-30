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
const calendar = google.calendar({ version: 'v3' });
const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar'],  // Full access to Google Calendar
});

// Function to create an appointment event on Google Calendar (no attendees)
const createCalendarEvent = async (appointmentDateTime, reason, firstName, lastName) => {
  try {
    console.log('Creating calendar event with the following data:', { appointmentDateTime, reason, firstName, lastName });

    // Build the event object without the attendees field
    const event = {
      summary: `Appointment for ${firstName} ${lastName}`, // Event title
      location: 'Joe\'s AutoShop',                        // Event location
      description: `Reason: ${reason}`,                    // Event description
      start: {
        dateTime: new Date(appointmentDateTime).toISOString(), // Convert appointmentDateTime to ISO format
        timeZone: 'America/Los_Angeles', // Set timezone
      },
      end: {
        dateTime: new Date(new Date(appointmentDateTime).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        timeZone: 'America/Los_Angeles', // Set timezone
      },
      // No attendees needed (since you don't want invites or attendee emails)
    };

    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      auth,
      calendarId: 'joeottoshap@gmail.com',  // Use the primary calendar
      resource: event,        // Event data
    });

    console.log('Google Calendar event created:', response.data);
    return { success: true, message: 'Appointment confirmed and added to Google Calendar!' };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return { success: false, message: 'Error creating Google Calendar event.' };
  }
};

export { auth, calendar, createCalendarEvent };
