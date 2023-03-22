const express = require("express");
const adminController = require("../controllers/admin-controller");

const router = express.Router();

router.get("/all", adminController.getAdminData);
router.post("/edit_events", adminController.editEvents);
router.post("/edit_news", adminController.editNews);
router.post("/add_events", adminController.addEvents);
router.post("/add_news", adminController.AddNews);

module.exports = router;
