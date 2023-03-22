const express = require("express");
const adminController = require("../controllers/admin-controller");

const router = express.Router();

router.get("/all", adminController.getAdminData);

module.exports = router;
