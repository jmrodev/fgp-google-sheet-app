require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const calendarRoutes = require("./calendar/calendar.routes");
const gmailRoutes = require("./gmail/gmail.routes");
const sheetRoutes = require("./sheets/sheet.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

// Montar rutas de los módulos
app.use("/calendar", calendarRoutes);
app.use("/gmail", gmailRoutes);
app.use("/sheets", sheetRoutes);

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.json({ message: "API de Google Integrada: Calendar, Gmail, Sheets" });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
