const express = require("express");
const router = express.Router();
const gmailController = require("./gmail.controller");

router.post("/send", gmailController.sendEmail);

module.exports = router;
