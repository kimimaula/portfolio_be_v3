const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    required: true,
  },
});

const News = mongoose.model("News", NewsSchema);

module.exports = News;
