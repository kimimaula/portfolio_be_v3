const express = require("express");
const newsController = require("../Controllers/news-controllers");

const router = express.Router();

router.get("/latest", newsController.getNews);

module.exports = router;
