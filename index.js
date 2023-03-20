"use strict";

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

app.use(express.json());

// routes
const usersRoutes = require("./Routes/users-routes");

// app.get("/", (req, res) => res.send("Hello World"));

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
