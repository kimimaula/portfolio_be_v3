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
          from: Reviews.collection.name,
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $addFields: {
          reviews: {
            $filter: {
              input: "$reviews",
              as: "review",
              cond: { $eq: ["$$review.status", "published"] },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$reviews",
          preserveNullAndEmptyArrays: true,
        },
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
        $unwind: {
          path: "$reviews.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "reviews.rating": {
            $ifNull: [{ $toInt: "$reviews.rating" }, 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          eventName: { $first: "$eventName" },
          description: { $first: "$description" },
          reviews: {
            $push: {
              $cond: [{ $eq: ["$reviews", null] }, null, "$reviews"],
            },
          },
          averageRating: { $avg: "$reviews.rating" },
          reviewCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          eventName: 1,
          description: 1,
          reviews: 1,
          averageRating: 1,
          reviewCount: {
            $cond: [
              { $eq: ["$reviewCount", 0] },
              0,
              { $subtract: ["$reviewCount", 1] },
            ],
          },
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
    const eventsWithAverageRating = await Events.aggregate([
      {
        $match: {
          status: "published",
        },
      },
      {
        $lookup: {
          from: Reviews.collection.name,
          localField: "_id",
          foreignField: "event",
          as: "reviews",
        },
      },
      {
        $addFields: {
          reviews: {
            $filter: {
              input: "$reviews",
              as: "review",
              cond: { $eq: ["$$review.status", "published"] },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$reviews",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "reviews.rating": {
            $ifNull: [{ $toDouble: "$reviews.rating" }, 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          eventName: { $first: "$eventName" },
          description: { $first: "$description" },
          status: { $first: "$status" },
          user: { $first: "$user" },
          averageRating: { $avg: "$reviews.rating" },
          reviewCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          eventName: 1,
          description: 1,
          status: 1,
          user: 1,
          averageRating: 1,
          reviewCount: {
            $cond: [
              { $eq: ["$reviewCount", 0] },
              0,
              { $subtract: ["$reviewCount", 1] },
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      data: eventsWithAverageRating,
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
