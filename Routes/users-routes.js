const express = require("express");
const userControllers = require("../controllers/users-controllers");

const router = express.Router();

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/sendOtp", userControllers.getToken);
router.post("/verifyOtp", userControllers.verifyOtp);
router.post("/changePassword", userControllers.changePassword);

module.exports = router;
