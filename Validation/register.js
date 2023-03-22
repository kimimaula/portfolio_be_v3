const Validator = require("validator");
const User = require("../Models/Users/user");
const isEmpty = require("is-empty");

module.exports = async function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //username and email uniqueness test
  let existingUserEmail;
  let existingUsername;

  try {
    existingUserEmail = await User.find({ email: data.email });
    existingUsername = await User.find({ username: data.username });
  } catch (err) {
    errors = err.message;
  }

  if (!isEmpty(existingUserEmail)) {
    errors = "Email already exists! Please login instead";
  }

  if (!isEmpty(existingUsername)) {
    errors = "Username already taken";
  }

  if (Validator.isEmpty(data.username)) {
    errors = "Name field is required";
  }
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors = "Password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors = "Password must be at least 6 characters";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
