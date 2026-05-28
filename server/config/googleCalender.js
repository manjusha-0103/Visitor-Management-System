import {google} from 'googleapis'
import fs from 'fs'
import sql from '../db/database.js';


export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const scheduleEvent = async ({summary,
      description,
      startDateTime,
      endDateTime,
      attendees}, employeeId) => {


        const [employee] = await sql`
            SELECT
            *
            FROM "Users"
            WHERE id = ${employeeId}
        `;

    if (!employee) {
        throw new Error('Employee not found');
    }

  if (!employee.google_calendar_connected) {
    throw new Error('Google Calendar not connected');
  } 

    oauth2Client.setCredentials({
  access_token: employee.google_access_token,
  refresh_token: employee.google_refresh_token,
  expiry_date: employee.google_token_expiry,
});

    // const client = await oauth2Client.getClient();

    const calendar = google.calendar({
        version: 'v3',
        auth: oauth2Client,
    });

    const event = {
        summary,
        description,

        start: {
            dateTime: startDateTime,
            timeZone: 'Asia/Kolkata',
        },

        end: {
            dateTime: endDateTime,
            timeZone: 'Asia/Kolkata',
        },

        attendees: attendees.map(email => ({ email })),

        reminders: {
            useDefault: false,
            overrides: [
            { method: 'email', minutes: 30 },
            { method: 'popup', minutes: 10 },
            ],
        },

        // conferenceData: {
        //     createRequest: {
        //     requestId: `meet-${Date.now()}`,
        //     conferenceSolutionKey: {
        //         type: 'hangoutsMeet',
        //     },
        //     },
        // },
    };


    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });


    return response
    
}