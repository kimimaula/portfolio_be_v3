const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  event: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events",
  },
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    required: true,
  },
});

const Reviews = mongoose.model("Reviews", ReviewSchema);

module.exports = Reviews;
