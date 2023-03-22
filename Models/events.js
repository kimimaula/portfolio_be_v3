const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  reviews: [
    {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Events = mongoose.model("Events", EventSchema);

module.exports = Events;
