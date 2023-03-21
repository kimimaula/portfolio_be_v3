const express = require("express");
const eventsController = require("../controllers/event-controller");

const router = express.Router();

router.get("/latest", eventsController.getEvents);

module.exports = router;
