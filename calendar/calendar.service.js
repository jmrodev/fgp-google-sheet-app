const { google } = require("googleapis");
const path = require('path');

class CalendarService {
  constructor() {
    this.CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
    if (!this.CALENDAR_ID) {
      throw new Error("GOOGLE_CALENDAR_ID no está configurado en las variables de entorno");
    }

    const keyFilePath = path.resolve(__dirname, "../credentials.json");

    this.auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
      ],
    });
  }

  async getClient() {
    try {
      return await this.auth.getClient();
    } catch (error) {
      console.error("Error al obtener cliente de autenticación:", error.message);
      throw new Error("Error de autenticación con Google Calendar API");
    }
  }

  async createEvent(eventData) {
    try {
      if (!eventData.summary || !eventData.start || !eventData.end) {
        throw new Error("Faltan campos obligatorios para el evento (summary, start, end)");
      }

      const client = await this.getClient();
      const calendar = google.calendar({ version: "v3", auth: client });

      const event = {
        summary: eventData.summary,
        description: eventData.description || '',
        start: {
          dateTime: eventData.start,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: eventData.end,
          timeZone: 'America/Los_Angeles',
        },
      };

      const response = await calendar.events.insert({
        calendarId: this.CALENDAR_ID,
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error("Error al crear evento:", error.message);
      throw new Error(`Error al crear evento: ${error.message}`);
    }
  }
}

module.exports = new CalendarService();
