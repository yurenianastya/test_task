const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listBusyIntervals(auth, calendarId, startTime, endTime) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: calendarId,
    timeMin: startTime,
    timeMax: endTime,
    maxResults: 2000,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  const busyIntervals = [];

  events.forEach(event => {
    const start = event.start.dateTime || event.start.date;
    const end = event.end.dateTime || event.end.date;
    busyIntervals.push({ start: start, end: end });
  });
  return busyIntervals;
}

const calendarId = ''; // Google calendar ID
const startTime = new Date('May 15, 2024 03:00:00')
const endTime = new Date('May 17, 2024 03:00:00')

authorize()
  .then(auth => {
    return listBusyIntervals(auth, calendarId, startTime, endTime);
  })
  .then(busyIntervals => {
    console.log('Busy time intervals:', busyIntervals);
  })
  .catch(console.error);