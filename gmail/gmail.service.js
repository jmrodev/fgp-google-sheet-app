const { google } = require("googleapis");
const path = require('path');
const nodemailer = require('nodemailer');

class GmailService {
  constructor() {
    const keyFilePath = path.resolve(__dirname, "../credentials.json");

    this.auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/gmail.send"
      ],
    });
  }

  async getClient() {
    try {
      return await this.auth.getClient();
    } catch (error) {
      console.error("Error al obtener cliente de autenticación:", error.message);
      throw new Error("Error de autenticación con Google API");
    }
  }

  async sendEmail(emailData) {
    try {
      if (!emailData.to || !emailData.subject || !emailData.text) {
        throw new Error("Faltan campos obligatorios para el correo (to, subject, text)");
      }

      const client = await this.getClient();
      const { token } = await client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_USER,
          clientId: client.clientId,
          clientSecret: client.clientSecret,
          refreshToken: client.credentials.refresh_token,
          accessToken: token,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
      };

      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error("Error al enviar correo:", error.message);
      throw new Error(`Error al enviar correo: ${error.message}`);
    }
  }
}

module.exports = new GmailService();
