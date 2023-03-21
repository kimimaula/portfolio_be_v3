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
      message: "Whoops, something went wrong. Please try again later",
    });
  }
};

exports.getNews = getNews;
