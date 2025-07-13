require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const sheetRoutes = require("./sheets/sheet.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/", sheetRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
