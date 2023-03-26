"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const packageJson = require("./package.json");
dotenv.config();

app.use(express.json());
app.use(cors());

// routes
const usersRoutes = require("./Routes/users-routes");
const newsRoutes = require("./Routes/news-routes");
const eventRoutes = require("./Routes/events-routes");
const reviewRoutes = require("./Routes/review-routes");
const adminRoutes = require("./Routes/admin-routes");

app.get("/", (req, res, next) => {
  return res.json(
    `Hello, App version ${packageJson.version} is running on ${process.env.PORT}`
  );
});

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/user", usersRoutes);

app.use((req, res, next) => {
  return res.status(404).json("This route is invalid");
});

mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    console.log(`-----connected, now listening to ${process.env.PORT} `);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
