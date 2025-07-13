require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para recibir JSON
app.use(express.json());
app.use(morgan("dev"));

// Cargar credenciales del servicio
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // Asegúrate de tener este archivo
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Tu ID de Google Sheets
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

app.post("/send/:sheetName", async (req, res) => {
  try {
    const sheetName = req.params.sheetName;
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Agregar los datos a la hoja
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[new Date().toISOString(), nombre, correo, mensaje]],
      },
    });

    res.status(200).json({ message: "Datos enviados correctamente", result: response.data });
  } catch (error) {
    console.error("Error al enviar datos:", error);
    res.status(500).json({ error: "Error al enviar datos a Google Sheet" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
