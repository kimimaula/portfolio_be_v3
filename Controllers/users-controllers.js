const User = require("../models/user");
const validateRegisterInput = require("../validation/register");

const saltRounds = 12;
const bcrypt = require("bcryptjs");

//<------------------------gets specific user, needs token as this will be the dashboard----------------------------------------->
const getUser = async (req, res, next) => {
  //   const authHeaderValue = req.headers["authorization"];

  //   if (!authHeaderValue) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Whoops, token unavailable. Try to log out and back in again",
  //     });
  //   }

  //   const token = await authHeaderValue.replace("Bearer ", "");
  //   const { error, id } = await validateToken(token);

  //   if (error) {
  //     return res.status(404).send({
  //       success: false,
  //       message: "Whoops, token unavailable. Try to log out and back in again",
  //     });
  //   }

  //   let currentUser;

  //   try {
  //     currentUser = await User.find({ _id: id }, "-password");
  //   } catch (e) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Whoops, cannot find the user you are looking for",
  //     });
  //   }

  //  if (isEmpty(currentUser)) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Whoops, cannot find the user you are looking for",
  //     });
  //   }

  res.status(201).json({ hey: "Hello world" });
};

const register = async (req, res, next) => {
  const { errors, isValid } = await validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(422).json({
      success: false,
      message: errors,
    });
  }

  const { username, email, password } = req.body;

  const createdUser = new User({
    username,
    email,
    password,
    reviews: [],
    notes: [],
  });

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(createdUser.password, salt, async (err, hash) => {
      try {
        createdUser.password = hash;
        await createdUser.save();
        res.status(201).json({ status: "success" });
      } catch (err) {
        return res.status(422).json({
          status: "error",
          message: "Whoops, something went wrong. Please try again later",
        });
      }
    });
  });
};

exports.getUser = getUser;
exports.register = register;
