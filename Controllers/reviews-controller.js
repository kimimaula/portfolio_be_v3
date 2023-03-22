const Reviews = require("../models/reviews");
const Events = require("../models/events");
const validateToken = require("../validation/validatetoken");

// get reviews owned by one user, auth needed
const getUserREviews = async (req, res, next) => {
  try {
    const authHeaderValue = req.headers["authorization"];

    if (!authHeaderValue) {
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
        return {
          _id: review._id,
          review: review.review,
          eventNane: review.event.eventName,
          rating: review.rating,
          event: review.event,
          user: review.user,
        };
      }),
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: "Whoops, something went wrong. Please try again later",
    });
  }
};

// add reviews, auth needed
const addReviews = async (req, res, next) => {
  try {
    const authHeaderValue = req.headers["authorization"];

    if (!authHeaderValue) {
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
    return res.status(422).json({
      status: "error",
      message: "Whoops, something went wrong. Please try again later",
    });
  }
};

exports.addReviews = addReviews;
exports.getUserREviews = getUserREviews;
