const CalendarService = require("./calendar.service");

class CalendarController {
  calendarService = CalendarService;

  handleError(err, res, operation = "operación") {
    console.error(`Error en ${operation}:`, err.message);

    if (err.message.includes("GOOGLE_CALENDAR_ID no está configurado")) {
      return res.status(500).json({
        error: "Configuración faltante. Verifica que GOOGLE_CALENDAR_ID esté configurado en las variables de entorno.",
        details: err.message
      });
    }

    if (err.message.includes("Error de autenticación")) {
      return res.status(401).json({
        error: "Error de autenticación con Google Calendar API. Verifica las credenciales.",
        details: err.message
      });
    }

    if (err.message.includes("Faltan campos obligatorios")) {
      return res.status(400).json({
        error: "Solicitud inválida. Asegúrate de incluir summary, start y end para el evento.",
        details: err.message
      });
    }

    return res.status(500).json({
      error: `Error en ${operation}: ${err.message}`,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  createEvent = async (req, res) => {
    try {
      const event = await this.calendarService.createEvent(req.body);
      res.status(201).json({ message: "Evento creado correctamente", event });
    } catch (err) {
      this.handleError(err, res, "crear evento");
    }
  };
}

module.exports = new CalendarController();
