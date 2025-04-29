import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname because we are using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the service account key JSON file
const KEYFILEPATH = path.join(__dirname, '../config/calendar-access.json');

// Define the required scopes
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// ID of your public calendar
const calendarId = 'joeottoshap@gmail.com';

// Create an event using the appointment's date (default path)
export async function createCalendarEvent(appointment) {
  const calendar = google.calendar({ version: 'v3', auth });

  const startDateTime = new Date(appointment.date);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 min default duration

  const event = {
    summary: `Appointment with ${appointment.firstName} ${appointment.lastName}`,
    description: `
Reason: ${appointment.reason}
Phone: ${appointment.phone}
Email: ${appointment.email}
Vehicle ID: ${appointment.vehicleId}
    `.trim(),
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'America/Los_Angeles',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });

    console.log('Event created:', response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error);
    throw new Error('Failed to create calendar event');
  }
}

// Create an event manually with admin-selected start and duration
export async function createCalendarEventCustom(appointment, duration) {
  const calendar = google.calendar({ version: 'v3', auth });

  const startDateTime = new Date(appointment.date);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

  const event = {
    summary: `Appointment with ${appointment.firstName} ${appointment.lastName}`,
    description: `
Reason: ${appointment.reason}
Phone: ${appointment.phone}
Email: ${appointment.email}
Vehicle ID: ${appointment.vehicleId}
    `.trim(),
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'America/Los_Angeles',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });

    console.log('Custom event created:', response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error('Error creating custom event:', error.response?.data || error);
    throw new Error('Failed to create custom calendar event');
  }
}
