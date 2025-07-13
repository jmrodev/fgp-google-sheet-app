const express = require("express");
const router = express.Router();
const controller = require("./sheet.controller"); // Ya es una instancia

router.get("/sheets", controller.getSheets.bind(controller));
router.get("/headers/:sheetName", controller.getHeaders.bind(controller));
router.post("/headers/:sheetName", controller.setHeadersIfMissing.bind(controller));
router.post("/send/:sheetName", controller.sendData.bind(controller));
router.get("/data/:sheetName", controller.getSheetData.bind(controller));
router.put("/update/:sheetName/:rowIndex", controller.updateRow.bind(controller));
router.delete("/delete/:sheetName/:rowIndex", controller.deleteRow.bind(controller));
router.get("/find/:sheetName", controller.findByCorreo.bind(controller));

module.exports = router;
