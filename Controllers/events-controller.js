const Events = require("../models/events");

const getEventsName = async (req, res, next) => {
  try {
    const events = await Events.find({}, { _id: 1, eventName: 1 });
    return res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: "Whoops, something went wrong. Please try again later",
    });
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Events.find();
    return res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: "Whoops, something went wrong. Please try again later",
    });
  }
};

exports.getEventsName = getEventsName;
exports.getAllEvents = getAllEvents;
