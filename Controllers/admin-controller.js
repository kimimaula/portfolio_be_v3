const Reviews = require("../Models/Reviews/reviews");
const Events = require("../Models/Events/events");
const User = require("../Models/Users/user");
const News = require("../Models/News/news");
const validateToken = require("../validation/validatetoken");
const isEmpty = require("is-empty");

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
// const addNotes = async (req, res, next) => {
//   try {
//     const authHeaderValue = req.headers && req.headers.authorization;
//     if (
//       !authHeaderValue ||
//       authHeaderValue === "undefined" ||
//       authHeaderValue === ""
//     ) {
//       return res.status(422).json({
//         success: false,
//         message: "You are required to login to add reviews",
//       });
//     }
//     const token = await authHeaderValue.replace("Bearer ", "");
//     const { error, id } = await validateToken(token);
//     // const { eventName, review, rating, event } = req.body;
//     const createdNotes = new Notes({
//       review,
//       rating,
//       event,
//       user: id,
//     });

//     // await createdNotes.save();

//     // await User.updateOne(
//     //   { _id: event },
//     //   { $push: { reviews: createdNotes._id } }
//     // );

//     return res.status(200).json({
//       status: "success",
//     });
//   } catch (error) {
//     console.log("---error", error);
//     return res.status(422).json({
//       status: "error",
//       message: error?.errors?.event?.message || "An unexpected error occured",
//     });
//   }
// };

// exports.addNotes = addNotes;
exports.getAdminData = getAdminData;
