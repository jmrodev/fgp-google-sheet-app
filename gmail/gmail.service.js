const { google } = require("googleapis");
const nodemailer = require('nodemailer');
const getGoogleClient = require("../googleAuth");

class GmailService {
  async sendEmail(emailData) {
    try {
      if (!emailData.to || !emailData.subject || !emailData.text) {
        throw new Error("Faltan campos obligatorios para el correo (to, subject, text)");
      }

      const client = await getGoogleClient();
      const { token } = await client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_USER,
          clientId: client._clientId,
          clientSecret: client._clientSecret,
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
