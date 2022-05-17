const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewById,
  patchReviewVotesById,
} = require("./controllers/reviews.controller");

const app = express();

//GET
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

//PATCH
app.patch("/api/reviews/:review_id", patchReviewVotesById);

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
