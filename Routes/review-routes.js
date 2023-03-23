const express = require("express");
const reviewController = require("../controllers/reviews-controller");

const router = express.Router();

router.post("/add", reviewController.addReviews);
router.get("/getUserReview", reviewController.getUserReviews);
router.post("/editReviews", reviewController.editReviews);

module.exports = router;
