const mongoose = require("mongoose");

const NewsItemSchema = new mongoose.Schema({
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

const News = mongoose.model("News", NewsItemSchema);

module.exports = News;
