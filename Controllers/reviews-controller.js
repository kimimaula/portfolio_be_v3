const Reviews = require("../Models/Reviews/reviews");
const Events = require("../Models/Events/events");
const validateToken = require("../validation/validatetoken");
const isEmpty = require("is-empty");

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
      .select("review rating event user");

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
    const { eventName, review, rating, event } = req.body;
    const createdReview = new Reviews({
      review,
      rating,
      event,
      user: id,
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

exports.addReviews = addReviews;
exports.getUserReviews = getUserReviews;
