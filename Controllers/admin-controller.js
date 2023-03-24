const Reviews = require("../Models/Reviews/reviews");
const Events = require("../Models/Events/events");
const User = require("../Models/Users/user");
const News = require("../Models/News/news");
const validateToken = require("../Validation/validateToken");
const isEmpty = require("is-empty");
const mongoose = require("mongoose");

// get reviews owned by one user, auth needed
const getAdminData = async (req, res, next) => {
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
    const { error, id, isAdmin } = await validateToken(token);

    if (!isAdmin) {
      return res.status(422).json({
        success: false,
        message: "Only admins allowed",
      });
    }

    const reviews = await Reviews.find({})
      .populate({ path: "user", select: "username" })
      .populate({ path: "event", select: "eventName" })
      .select("review rating user event");

    const events = await Events.find({})
      .populate({ path: "reviews", select: "review rating user" })
      .select("eventName description status");

    const newsItems = await News.find();

    return res.status(200).json({
      status: "success",
      data: {
        reviews: reviews.map((review) => ({
          review: review.review,
          rating: review.rating,
          user: review.user.username,
          eventName: review.event.eventName,
        })),
        events,
        newsItems,
      },
    });
  } catch (error) {
    console.log("----error", error);
    return res.status(422).json({
      status: "error",
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }
};

// add reviews, auth needed
const editEvents = async (req, res, next) => {
  try {
    const authHeaderValue = req.headers && req.headers.authorization;
    const { _id, status, eventDescription, eventName } = req.body;

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
    const { error, id, isAdmin } = await validateToken(token);

    if (!isAdmin) {
      return res.status(422).json({
        success: false,
        message: "Only admins allowed",
      });
    }

    const EventId = new mongoose.Types.ObjectId(req.body._id);

    await Events.updateOne(
      { _id: EventId },
      { $set: { status, description: eventDescription, eventName } }
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

const editNews = async (req, res, next) => {
  try {
    const authHeaderValue = req.headers && req.headers.authorization;
    const { _id, status, description, title } = req.body;

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
    const { error, id, isAdmin } = await validateToken(token);

    if (!isAdmin) {
      return res.status(422).json({
        success: false,
        message: "Only admins allowed",
      });
    }

    const updatedNews = {
      status: status,
      description: description,
      title: title,
      user: new mongoose.Types.ObjectId(id),
    };

    const NewsId = new mongoose.Types.ObjectId(req.body._id);

    await News.updateOne(
      { _id: NewsId },
      { $set: { status, description, title } }
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

const addEvents = async (req, res, next) => {
  try {
    const authHeaderValue = req.headers && req.headers.authorization;
    const { _id, status, description, eventName } = req.body;

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
    const { error, id, isAdmin } = await validateToken(token);

    if (!isAdmin) {
      return res.status(422).json({
        success: false,
        message: "Only admins allowed",
      });
    }

    const createdEvent = new Events({
      status,
      description,
      eventName,
      user: id,
      reviews: [],
    });

    await createdEvent.save();

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

const AddNews = async (req, res, next) => {
  try {
    const authHeaderValue = req.headers && req.headers.authorization;
    const { _id, status, description, title } = req.body;

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
    const { error, id, isAdmin } = await validateToken(token);

    if (!isAdmin) {
      return res.status(422).json({
        success: false,
        message: "Only admins allowed",
      });
    }

    const createdNews = new News({
      status,
      description,
      title,
      user: id,
    });

    await createdNews.save();

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

exports.addEvents = addEvents;
exports.AddNews = AddNews;
exports.editNews = editNews;
exports.editEvents = editEvents;
exports.getAdminData = getAdminData;
