const Reviews = require("../models/reviews");
const Events = require("../models/events");
const Notes = require("../models/notes");
const validateToken = require("../validation/validatetoken");
const isEmpty = require("is-empty");

// get reviews owned by one user, auth needed
const getUserNotes = async (req, res, next) => {
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

    return res.status(200).json({
      status: "success",
      data: "test",
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }
};

// add reviews, auth needed
const addNotes = async (req, res, next) => {
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

exports.addNotes = addNotes;
exports.getUserNotes = getUserNotes;
