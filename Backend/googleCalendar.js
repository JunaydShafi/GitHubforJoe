import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Resolve __dirname (ES Module compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load credentials
const credentials = process.env.GOOGLE_SERVICE_EMAIL
  ? {
      client_email: process.env.GOOGLE_SERVICE_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }
  : JSON.parse(readFileSync(path.join(__dirname, 'config', 'calendar-access.json')));

// Initialize calendar
const calendar = google.calendar('v3');
const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

// Helper: Format time in correct local format for Google Calendar
const formatLocalTime = (datetime) => {
  const dt = new Date(datetime);
  return dt.toLocaleString('sv-SE', { timeZone: 'America/Los_Angeles' }).replace(' ', 'T');
};

// Function to create a calendar event
const createCalendarEvent = async (appointmentDateTime, reason, firstName, lastName) => {
  try {
    const startTime = formatLocalTime(appointmentDateTime);
    const endTime = formatLocalTime(new Date(new Date(appointmentDateTime).getTime() + 60 * 60 * 1000));

    const calendarEvent = {
      summary: `Appointment for ${firstName} ${lastName}`,
      location: "Joe's AutoShop",
      description: reason,
      start: {
        dateTime: startTime,
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: endTime,
        timeZone: 'America/Los_Angeles',
      },
    };

    const response = await calendar.events.insert({
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      resource: calendarEvent,
    });

    console.log('✅ Google Calendar event created:', response.data);
    return {
      success: true,
      message: 'Appointment confirmed and added to Google Calendar!',
      eventLink: response.data.htmlLink,
    };
  } catch (error) {
    console.error('❌ Error adding to Google Calendar:', error);
    return {
      success: false,
      message: `Error adding event to Google Calendar: ${error.message || error}`,
    };
  }
};

export { auth, calendar, createCalendarEvent };
