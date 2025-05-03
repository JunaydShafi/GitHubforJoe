/*
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(
  readFileSync(path.join(__dirname, 'config', 'calendar-access.json'))
);

const { client_email, private_key } = credentials;

const auth = new google.auth.JWT({
  email: client_email,
  key: private_key,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

export async function createCalendarEvent(dateTime, reason, firstName, lastName, email) {
  try {
    const event = {
      summary: `Appointment for ${firstName} ${lastName}`,
      location: "Joe's AutoShop",
      description: reason,
      start: {
        dateTime,
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(new Date(dateTime).getTime() + 60 * 60 * 1000),
        timeZone: 'America/Los_Angeles',
      },
      attendees: [{ email }],
    };

    const response = await calendar.events.insert({
      calendarId: 'joeottoshap@gmail.com',
      resource: event,
    });

    console.log('✅ Calendar event created:', response.data);
    return { success: true, eventId: response.data.id };
  } catch (error) {
    console.error('❌ Failed to create calendar event:', error);
    return { success: false, error };
  }
}

export { calendar, auth };
*/
