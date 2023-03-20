const express = require("express");
const userControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/test", userControllers.getUser);

router.post("/register", userControllers.register);

module.exports = router;
