const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateOtpOInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data._id = !isEmpty(data._id) ? data._id : "";

  // username checks
  if (Validator.isEmpty(data.username)) {
    errors = "Username field is required";
  }

  // _id checks
  if (Validator.isEmpty(data._id)) {
    errors = "_id field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
