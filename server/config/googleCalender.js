import {google} from 'googleapis'
import fs from 'fs'

// const auth = new google.auth.GoogleAuth({
//   credentials: {
//     project_id: process.env.GOOGLE_PROJECT_ID,

//     client_email: process.env.GOOGLE_CLIENT_EMAIL,

//     private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   },

//   scopes: ['https://www.googleapis.com/auth/calendar'],
// });


export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);




export const scheduleEvent = async ({summary,
      description,
      startDateTime,
      endDateTime,
      attendees}) => {

    const tokens = JSON.parse(fs.readFileSync('tokens.json'));

    oauth2Client.setCredentials(tokens);

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