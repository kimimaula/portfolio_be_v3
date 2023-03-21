const Reviews = require("../models/reviews");
const validateToken = require("../validation/validatetoken");

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
