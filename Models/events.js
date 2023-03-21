const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
});

const Events = mongoose.model("Events", EventSchema);

module.exports = Events;
