const express = require("express");
const adminController = require("../controllers/admin-controller");

const router = express.Router();

router.get("/all", adminController.getAdminData);
router.post("/edit_events", adminController.editEvents);
router.post("/edit_news", adminController.editNews);

module.exports = router;
