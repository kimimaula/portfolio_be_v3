const News = require("../models/news");

const getNews = async (req, res, next) => {
  try {
    const news = await News.find();
    return res.status(200).json({
      status: "success",
      data: news,
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error?.errors?.event?.message || "An unexpected error occured",
    });
  }
};

exports.getNews = getNews;
