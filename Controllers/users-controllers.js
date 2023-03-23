const saltRounds = 12;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require("is-empty");
const nodemailer = require("nodemailer");
const axios = require("axios");

const User = require("../Models/Users/user");
const UserOtp = require("../Models/UserOtp/userOtp");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../Validation/login");

const login = async (req, res, next) => {
  const { errors, isValid } = await validateLoginInput(req.body);

  if (!isValid) {
    return res.status(422).json({
      success: false,
      message: errors || "An unexpected error occured",
    });
  }

  let user;
  try {
    user = await User.findOne({ username: req.body.username });
  } catch {
    return res.status(500).json({
      success: false,
      message: errors || "An unexpected error occured",
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
          isAdmin: user.isAdmin,
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
      message: errors || "An unexpected error occured",
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

const getToken = async (req, res, next) => {
  const { email } = req.body;

  try {
    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);

    const apiKey = process.env.EMAILAPIKEY;
    const url = "https://api.sendinblue.com/v3/smtp/email";

    const emailData = {
      sender: {
        name: "Otp Verification",
        email: "kimimaula@gmail.com",
      },
      to: [
        {
          email: "kimimaula@gmail.com",
          name: "User",
        },
      ],
      subject: "Otp Verification",
      htmlContent: `<p>Your OTP is ${otp}</p>`,
    };

    const headers = {
      "api-key": apiKey,
      "Content-Type": "application/json",
    };

    try {
      const user = await User.find({ email: email });
      const newOtp = await new UserOtp({
        UserId: user[0]?._id,
        otp: otp,
        createdAt: new Date(),
      });

      const result = await newOtp.save();
      if (!result) {
        return res.status(422).json({
          status: "error",
          message: "Otp creation failed",
        });
      }
      await axios.post(url, emailData, { headers });
      res.status(201).json({ status: "success" });
    } catch (error) {
      console.error(error);
      return res.status(422).json({
        status: "error",
        message: "Otp creation failed",
      });
    }
  } catch (error) {
    console.log("---error", error);
    return res.status(422).json({
      status: "error",
      message: "Otp creation failed",
    });
  }
};

const verifyOtp = async (req, res, next) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(422).json({
      status: "error",
      message: "Email and Otp required",
    });
  }
  const dbOtp = await UserOtp.find({ otp: otp });
  if (!dbOtp || dbOtp?.length === 0)
    return res.status(422).json({ status: "error", message: "Otp not found" });

  return res.json({ status: "success" });
};

const changePassword = async (req, res, next) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).json({
      status: "error",
      message: "Email and Password required",
    });
  }

  const existingUser = await User.find({ email: email });
  console.log("----existingUser", existingUser);

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, async (err, hash) => {
      try {
        await User.updateOne(
          { _id: existingUser[0]?.id },
          { $set: { password: hash } }
        );
        res.status(201).json({ status: "success" });
      } catch (error) {
        console.log("---error", error);
        return res.status(422).json({
          status: "error",
          message:
            error?.errors?.event?.message || "An unexpected error occured",
        });
      }
    });
  });
};

exports.changePassword = changePassword;
exports.verifyOtp = verifyOtp;
exports.getToken = getToken;
exports.register = register;
exports.login = login;
