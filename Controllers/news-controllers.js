const News = require("../Models/News/news");

const getNews = async (req, res, next) => {
  try {
    const news = await News.find({ status: "published" });
    return res.status(200).json({
      status: "success",
      data: news,
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message:
        error?.errors?.event?.message ||
        error?.message ||
        "An unexpected error occured",
    });
  }
};

exports.getNews = getNews;
