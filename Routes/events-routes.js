const express = require("express");
const eventsController = require("../controllers/events-controller");

const router = express.Router();

router.get("/names", eventsController.getEventsName);
router.get("/all", eventsController.getAllEvents);
router.get("/event", eventsController.getEvent);

module.exports = router;
