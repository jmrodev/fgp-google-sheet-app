require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const sheetRoutes = require("./sheets/sheet.routes");
const calendarRoutes = require("./calendar/calendar.routes");
const gmailRoutes = require("./gmail/gmail.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/sheets", sheetRoutes);
app.use("/calendar", calendarRoutes);
app.use("/gmail", gmailRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
