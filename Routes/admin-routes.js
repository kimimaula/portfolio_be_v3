const express = require("express");
const adminController = require("../controllers/admin-controller");

const router = express.Router();

router.post("/getReviews", adminController.getReviews);

module.exports = router;
