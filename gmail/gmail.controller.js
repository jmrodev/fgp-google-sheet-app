const GmailService = require("./gmail.service");

class GmailController {
  gmailService = GmailService;

  handleError(err, res, operation = "operación") {
    console.error(`Error en ${operation}:`, err.message);

    if (err.message.includes("Error de autenticación")) {
      return res.status(401).json({
        error: "Error de autenticación con Google API. Verifica las credenciales.",
        details: err.message
      });
    }

    if (err.message.includes("Faltan campos obligatorios")) {
      return res.status(400).json({
        error: "Solicitud inválida. Asegúrate de incluir to, subject, y text para el correo.",
        details: err.message
      });
    }

    return res.status(500).json({
      error: `Error en ${operation}: ${err.message}`,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  sendEmail = async (req, res) => {
    try {
      const result = await this.gmailService.sendEmail(req.body);
      res.status(200).json({ message: "Correo enviado correctamente", result });
    } catch (err) {
      this.handleError(err, res, "enviar correo");
    }
  };
}

module.exports = new GmailController();
