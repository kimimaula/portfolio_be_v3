const saltRounds = 12;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require("is-empty");

const User = require("../models/user");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../Validation/login");

const login = async (req, res, next) => {
  const { errors, isValid } = await validateLoginInput(req.body);

  if (!isValid) {
    return res.status(422).json({
      success: false,
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }

  let user;
  try {
    user = await User.findOne({ username: req.body.username });
  } catch {
    return res.status(500).json({
      success: false,
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }

  if (isEmpty(user)) {
    return res
      .status(404)
      .json({ success: false, message: "Whoops, user does not exist" });
  }

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Whoops,passwords do not match" });
    }
    if (result) {
      jwt.sign(
        {
          id: user._id,
          user: user.username,
          email: user.email,
        },
        process.env.SECRETKEY,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Whoops,generating token failed, please try again later",
            });
          }
          res.json({
            success: true,
            token: "Bearer " + token,
            id: user._id,
            user: user.username,
          });
        }
      );
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Whoops,passwords do not match" });
    }
  });
};

const register = async (req, res, next) => {
  const { errors, isValid } = await validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(422).json({
      success: false,
      message: error?.errors?.event?.message || "An unexpected error occured",
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
          message:
            error?.errors?.event?.message || "An unexpected error occured",
        });
      }
    });
  });
};

exports.register = register;
exports.login = login;
