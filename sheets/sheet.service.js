const { google } = require("googleapis");

class SheetService {
  constructor() {
    this.SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
    if (!this.SPREADSHEET_ID) {
      throw new Error("GOOGLE_SHEET_ID no está configurado en las variables de entorno");
    }
    
    this.auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
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
      throw new Error("Error de autenticación con Google Sheets API");
    }
  }

  // Validar y sanitizar nombre de hoja
  sanitizeSheetName(sheetName) {
    if (!sheetName || typeof sheetName !== 'string') {
      throw new Error("Nombre de hoja inválido");
    }
    
    // Remover caracteres problemáticos y espacios
    const sanitized = sheetName.trim().replace(/[^\w\s-]/g, '');
    if (!sanitized) {
      throw new Error("Nombre de hoja no puede estar vacío después de sanitización");
    }
    
    return sanitized;
  }

  // Verificar si la hoja existe
  async sheetExists(sheetName) {
    try {
      const sheets = await this.getSheets();
      return sheets.some(sheet => sheet.title === sheetName);
    } catch (error) {
      console.error("Error al verificar existencia de hoja:", error.message);
      return false;
    }
  }

  async getSheets() {
    try {
      const client = await this.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      const response = await sheets.spreadsheets.get({ 
        spreadsheetId: this.SPREADSHEET_ID 
      });
      
      return response.data.sheets.map((sheet) => ({
        title: sheet.properties.title,
        sheetId: sheet.properties.sheetId,
      }));
    } catch (error) {
      console.error("Error al obtener hojas:", error.message);
      if (error.code === 404) {
        throw new Error("Spreadsheet no encontrado. Verifica el GOOGLE_SHEET_ID");
      }
      throw new Error(`Error al obtener hojas: ${error.message}`);
    }
  }

  async getHeaders(sheetName) {
    try {
      const sanitizedSheetName = this.sanitizeSheetName(sheetName);
      
      // Verificar si la hoja existe
      const exists = await this.sheetExists(sanitizedSheetName);
      if (!exists) {
        throw new Error(`La hoja '${sanitizedSheetName}' no existe`);
      }

      const client = await this.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `'${sanitizedSheetName}'!1:1`,
      });

      return response.data.values?.[0] || [];
    } catch (error) {
      console.error("Error al obtener encabezados:", error.message);
      throw new Error(`Error al obtener encabezados: ${error.message}`);
    }
  }

  async setHeadersIfMissing(sheetName, headers) {
    try {
      if (!Array.isArray(headers) || headers.length === 0) {
        throw new Error("Encabezados inválidos");
      }

      const sanitizedSheetName = this.sanitizeSheetName(sheetName);
      
      // Verificar si la hoja existe
      const exists = await this.sheetExists(sanitizedSheetName);
      if (!exists) {
        throw new Error(`La hoja '${sanitizedSheetName}' no existe`);
      }

      const client = await this.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      const existing = await this.getHeaders(sanitizedSheetName);
      if (existing.length > 0) return { alreadyExists: true, headers: existing };

      await sheets.spreadsheets.values.update({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `'${sanitizedSheetName}'!A1`,
        valueInputOption: "RAW",
        requestBody: { values: [headers] },
      });

      return { created: true, headers };
    } catch (error) {
      console.error("Error al establecer encabezados:", error.message);
      throw new Error(`Error al establecer encabezados: ${error.message}`);
    }
  }

  async sendData(sheetName, { nombre, correo, mensaje }) {
    try {
      if (!nombre || !correo || !mensaje) {
        throw new Error("Faltan campos obligatorios");
      }

      const sanitizedSheetName = this.sanitizeSheetName(sheetName);
      
      // Verificar si la hoja existe
      const exists = await this.sheetExists(sanitizedSheetName);
      if (!exists) {
        throw new Error(`La hoja '${sanitizedSheetName}' no existe`);
      }

      const client = await this.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `'${sanitizedSheetName}'!A1`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [[new Date().toISOString(), nombre, correo, mensaje]],
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error al enviar datos:", error.message);
      throw new Error(`Error al enviar datos: ${error.message}`);
    }
  }

  async getSheetData(sheetName) {
    try {
      const sanitizedSheetName = this.sanitizeSheetName(sheetName);
      
      // Verificar si la hoja existe
      const exists = await this.sheetExists(sanitizedSheetName);
      if (!exists) {
        throw new Error(`La hoja '${sanitizedSheetName}' no existe`);
      }

      const client = await this.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `'${sanitizedSheetName}'`,
      });

      return response.data.values || [];
    } catch (error) {
      console.error("Error al obtener datos de la hoja:", error.message);
      throw new Error(`Error al obtener datos: ${error.message}`);
    }
  }

  async updateRow(sheetName, rowIndex, values) {
    try {
      if (!Array.isArray(values)) {
        throw new Error("Valores inválidos");
      }

      const sanitizedSheetName = this.sanitizeSheetName(sheetName);
      
      // Verificar si la hoja existe
      const exists = await this.sheetExists(sanitizedSheetName);
      if (!exists) {
        throw new Error(`La hoja '${sanitizedSheetName}' no existe`);
      }

      const client = await this.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      await sheets.spreadsheets.values.update({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `'${sanitizedSheetName}'!A${rowIndex}`,
        valueInputOption: "RAW",
        requestBody: { values: [values] },
      });
    } catch (error) {
      console.error("Error al actualizar fila:", error.message);
      throw new Error(`Error al actualizar fila: ${error.message}`);
    }
  }

  async deleteRow(sheetName, rowIndex) {
    try {
      const row = parseInt(rowIndex);
      if (isNaN(row) || row < 2) {
        throw new Error("Índice inválido (mínimo 2)");
      }

      const sanitizedSheetName = this.sanitizeSheetName(sheetName);
      
      // Verificar si la hoja existe
      const exists = await this.sheetExists(sanitizedSheetName);
      if (!exists) {
        throw new Error(`La hoja '${sanitizedSheetName}' no existe`);
      }

      const client = await this.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      const metadata = await sheets.spreadsheets.get({ 
        spreadsheetId: this.SPREADSHEET_ID 
      });
      const sheet = metadata.data.sheets.find((s) => s.properties.title === sanitizedSheetName);

      if (!sheet) throw new Error("Hoja no encontrada");

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheet.properties.sheetId,
                  dimension: "ROWS",
                  startIndex: row - 1,
                  endIndex: row,
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error al eliminar fila:", error.message);
      throw new Error(`Error al eliminar fila: ${error.message}`);
    }
  }

  async findByCorreo(sheetName, correo) {
    try {
      const sanitizedSheetName = this.sanitizeSheetName(sheetName);
      
      // Verificar si la hoja existe
      const exists = await this.sheetExists(sanitizedSheetName);
      if (!exists) {
        throw new Error(`La hoja '${sanitizedSheetName}' no existe`);
      }

      const rows = await this.getSheetData(sanitizedSheetName);
      if (rows.length < 2) return [];

      const headers = rows[0];
      const correoIndex = headers.indexOf("correo");
      if (correoIndex === -1) throw new Error("Columna 'correo' no encontrada");

      return rows.map((row, i) => ({ rowNumber: i + 1, row })).filter((r) => r.row[correoIndex] === correo);
    } catch (error) {
      console.error("Error al buscar por correo:", error.message);
      throw new Error(`Error al buscar por correo: ${error.message}`);
    }
  }
}

module.exports = new SheetService();
