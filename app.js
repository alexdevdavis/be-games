const express = require("express");
const {
  getCategories,
  getReviewById,
} = require("./controllers/games.controller.js");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
