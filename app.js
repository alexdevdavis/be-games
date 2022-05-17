const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const { getAllUsers } = require("./controllers/users.controller");
const {
  getReviewById,
  patchReviewVotesById,
} = require("./controllers/reviews.controller");

const app = express();
app.use(express.json());

//CATEGORIES
app.get("/api/categories", getCategories);

//REVIEWS
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewVotesById);

//USERS
app.get("/api/users", getAllUsers);

//ERRORS
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
