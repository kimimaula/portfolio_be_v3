const Events = require("../Models/Events/events");
const Reviews = require("../Models/Reviews/reviews");
const mongoose = require("mongoose");

const getEvent = async (req, res, next) => {
  const id = req.query.id;
  try {
    const event = await Events.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $unwind: "$reviews",
      },
      {
        $lookup: {
          from: "users",
          localField: "reviews.user",
          foreignField: "_id",
          as: "reviews.user",
        },
      },
      {
        $unwind: "$reviews.user",
      },
      {
        $group: {
          _id: "$_id",
          eventName: { $first: "$eventName" },
          description: { $first: "$description" },
          reviews: { $push: "$reviews" },
          averageRating: { $avg: { $toInt: "$reviews.rating" } },
        },
      },
    ]);
    return res.status(200).json({
      status: "success",
      data: event[0],
    });
  } catch (error) {
    console.log("---error", error);
    return res.status(422).json({
      status: "error",
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }
};

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
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const eventRatings = await Events.aggregate([
      {
        $lookup: {
          from: "reviews",
          let: { eventId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$event", "$$eventId"] } } },
            {
              $group: {
                _id: "$event",
                averageRating: { $avg: { $toDouble: "$rating" } },
              },
            },
          ],
          as: "reviews",
        },
      },
      {
        $project: {
          _id: 0,
          eventId: "$_id",
          eventName: 1,
          description: 1,
          averageRating: {
            $ifNull: [{ $arrayElemAt: ["$reviews.averageRating", 0] }, 0],
          },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      data: eventRatings,
    });
  } catch (error) {
    console.log("---error", error);
    return res.status(422).json({
      status: "error",
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }
};

exports.getEventsName = getEventsName;
exports.getAllEvents = getAllEvents;
exports.getEvent = getEvent;
