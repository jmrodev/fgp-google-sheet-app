const SheetService = require("./sheet.service");

class SheetController {
  sheetService = SheetService;

  // Middleware para manejo de errores
  handleError(err, res, operation = "operación") {
    console.error(`Error en ${operation}:`, err.message);
    
    // Errores específicos de Google Sheets
    if (err.message.includes("Unable to parse range")) {
      return res.status(400).json({ 
        error: "Error en el formato del rango de Google Sheets. Verifica que la hoja existe y el nombre es correcto.",
        details: err.message 
      });
    }
    
    if (err.message.includes("GOOGLE_SHEET_ID no está configurado")) {
      return res.status(500).json({ 
        error: "Configuración faltante. Verifica que GOOGLE_SHEET_ID esté configurado en las variables de entorno.",
        details: err.message 
      });
    }
    
    if (err.message.includes("Spreadsheet no encontrado")) {
      return res.status(404).json({ 
        error: "Google Sheet no encontrado. Verifica el ID del spreadsheet y los permisos.",
        details: err.message 
      });
    }
    
    if (err.message.includes("Error de autenticación")) {
      return res.status(401).json({ 
        error: "Error de autenticación con Google Sheets API. Verifica las credenciales.",
        details: err.message 
      });
    }
    
    if (err.message.includes("no existe")) {
      return res.status(404).json({ 
        error: err.message,
        suggestion: "Verifica que la hoja existe en tu Google Sheet"
      });
    }
    
    // Error genérico
    return res.status(500).json({ 
      error: `Error en ${operation}: ${err.message}`,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  getSheets = async (req, res) => {
    try {
      const sheets = await this.sheetService.getSheets();
      res.json({ sheets });
    } catch (err) {
      this.handleError(err, res, "obtener hojas");
    }
  };

  getHeaders = async (req, res) => {
    try {
      const headers = await this.sheetService.getHeaders(req.params.sheetName);
      res.json({ headers });
    } catch (err) {
      this.handleError(err, res, "obtener encabezados");
    }
  };

  setHeadersIfMissing = async (req, res) => {
    try {
      const result = await this.sheetService.setHeadersIfMissing(req.params.sheetName, req.body.headers);
      res.json(result);
    } catch (err) {
      this.handleError(err, res, "establecer encabezados");
    }
  };

  sendData = async (req, res) => {
    try {
      const result = await this.sheetService.sendData(req.params.sheetName, req.body);
      res.json({ message: "Datos enviados correctamente", result });
    } catch (err) {
      this.handleError(err, res, "enviar datos");
    }
  };

  getSheetData = async (req, res) => {
    try {
      const rows = await this.sheetService.getSheetData(req.params.sheetName);
      res.json({ data: rows });
    } catch (err) {
      this.handleError(err, res, "obtener datos de la hoja");
    }
  };

  updateRow = async (req, res) => {
    try {
      await this.sheetService.updateRow(req.params.sheetName, req.params.rowIndex, req.body.values);
      res.json({ message: "Fila actualizada correctamente." });
    } catch (err) {
      this.handleError(err, res, "actualizar fila");
    }
  };

  deleteRow = async (req, res) => {
    try {
      await this.sheetService.deleteRow(req.params.sheetName, req.params.rowIndex);
      res.json({ message: "Fila eliminada correctamente." });
    } catch (err) {
      this.handleError(err, res, "eliminar fila");
    }
  };

  findByCorreo = async (req, res) => {
    try {
      const results = await this.sheetService.findByCorreo(req.params.sheetName, req.query.correo);
      res.json({ results });
    } catch (err) {
      this.handleError(err, res, "buscar por correo");
    }
  };
}

module.exports = new SheetController();
