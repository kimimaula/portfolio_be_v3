const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // username checks

  if (Validator.isEmpty(data.username)) {
    errors = "Username field is required";
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
