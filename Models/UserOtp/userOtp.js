const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 },
    },
  },
  { timestamps: true }
);

const UserOtp = mongoose.model("UserOtp", OtpSchema);

module.exports = UserOtp;
