const { google } = require("googleapis");
const path = require('path');

const keyFilePath = path.resolve(__dirname, "./credentials.json");

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/gmail.send"
  ],
});

async function getGoogleClient() {
  try {
    return await auth.getClient();
  } catch (error) {
    console.error("Error al obtener cliente de autenticación:", error.message);
    throw new Error("Error de autenticación con Google API");
  }
}

module.exports = getGoogleClient; 