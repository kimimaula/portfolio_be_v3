const Reviews = require("../Models/Reviews/reviews");
const Events = require("../Models/Events/events");
const validateToken = require("../Validation/validateToken");
const isEmpty = require("is-empty");
const mongoose = require("mongoose");

// get reviews owned by one user, auth needed
const getUserReviews = async (req, res, next) => {
  try {
    const authHeaderValue = req?.headers["authorization"];

    if (
      !authHeaderValue ||
      typeof authHeaderValue === "undefined" ||
      authHeaderValue === ""
    ) {
      return res.status(422).json({
        success: false,
        message: "Login Required",
      });
    }

    const token = await authHeaderValue.replace("Bearer ", "");
    const { error, id } = await validateToken(token);

    const reviews = await Reviews.find({ user: id })
      .populate({
        path: "event",
        model: Events,
        select: "eventName",
      })
      .select("review rating event user status");

    return res.status(200).json({
      status: "success",
      data: reviews.map((review) => {
        // const event = review.event ? review.event.eventName : "";
        return {
          _id: review._id,
          review: review.review,
          rating: review.rating,
          event: review.event,
          user: review.user,
          status: review.status,
        };
      }),
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }
};

// add reviews, auth needed
const addReviews = async (req, res, next) => {
  try {
    const authHeaderValue = req.headers && req.headers.authorization;
    if (
      !authHeaderValue ||
      authHeaderValue === "undefined" ||
      authHeaderValue === ""
    ) {
      return res.status(422).json({
        success: false,
        message: "You are required to login to add reviews",
      });
    }
    const token = await authHeaderValue.replace("Bearer ", "");
    const { error, id } = await validateToken(token);
    const { eventName, review, rating, event, status } = req.body;
    const createdReview = new Reviews({
      review,
      rating,
      event,
      user: id,
      status,
    });

    await createdReview.save();

    await Events.updateOne(
      { _id: event },
      { $push: { reviews: createdReview._id } }
    );

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log("---error", error);
    return res.status(422).json({
      status: "error",
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }
};

const editReviews = async (req, res, next) => {
  try {
    const authHeaderValue = req.headers && req.headers.authorization;
    const { _id, review, rating, status } = req.body;

    if (
      !authHeaderValue ||
      authHeaderValue === "undefined" ||
      authHeaderValue === ""
    ) {
      return res.status(422).json({
        success: false,
        message: "You are required to login to edit reviews",
      });
    }
    const token = await authHeaderValue.replace("Bearer ", "");
    const { error, id } = await validateToken(token);

    const ReviewId = new mongoose.Types.ObjectId(req.body._id);

    await Reviews.updateOne(
      { _id: ReviewId },
      { $set: { review, rating, status } }
    );

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log("---error", error);
    return res.status(422).json({
      status: "error",
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }
};

exports.editReviews = editReviews;
exports.addReviews = addReviews;
exports.getUserReviews = getUserReviews;
