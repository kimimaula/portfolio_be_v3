const express = require("express");
const adminController = require("../Controllers/admin-controller");

const router = express.Router();

router.get("/all", adminController.getAdminData);
router.post("/editEvents", adminController.editEvents);
router.post("/editNews", adminController.editNews);
router.post("/addEvents", adminController.addEvents);
router.post("/addNews", adminController.AddNews);

module.exports = router;
