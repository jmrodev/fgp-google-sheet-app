const express = require("express");
const router = express.Router();
const calendarController = require("./calendar.controller");

// Ruta para crear un evento en el calendario
router.post("/events", calendarController.createEvent);

module.exports = router;
