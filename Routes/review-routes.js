const express = require("express");
const reviewController = require("../controllers/reviews-controller");

const router = express.Router();

router.post("/add", reviewController.addReviews);
router.get("/get_user_review", reviewController.getUserReviews);

module.exports = router;
