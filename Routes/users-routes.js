const express = require("express");
const userControllers = require("../Controllers/users-controllers");
const { multerUploads } = require("../Helpers/imgHandler");

const router = express.Router();

router.post("/register", multerUploads("avatar"), userControllers.register);
router.post("/login", userControllers.login);
router.post("/sendOtp", userControllers.getToken);
router.post("/changePassword", userControllers.changePassword);
router.get("/getUser", userControllers.getUser);

// router.get("/updateImages", async (req, res, next) => {
//   const result = await User.updateMany(
//     {},
//     {
//       avatar:
//         "https://portfolio-kimmi.s3-ap-southeast-1.amazonaws.com/robot.jpeg",
//     }
//   );
//   console.log("----result", result);
//   res.status(200).json({ message: "Avatars updated successfully." });
// });

module.exports = router;
