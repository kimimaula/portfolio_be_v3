const express = require("express");
const reviewController = require("../controllers/reviews-controller");

const router = express.Router();

router.post("/add", reviewController.addReviews);

module.exports = router;
