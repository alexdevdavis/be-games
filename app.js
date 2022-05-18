const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const { getAllUsers } = require("./controllers/users.controller");
const {
  getAllReviews,
  getReviewById,
  patchReviewVotesById,
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("./controllers/reviews.controller");

const app = express();
app.use(express.json());

//CATEGORIES
app.get("/api/categories", getCategories);

//REVIEWS
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchReviewVotesById);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

//USERS
app.get("/api/users", getAllUsers);

//ERRORS
app.use("/*", (req, res, next) => {
  res.status(404).send("path not found");
});

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
  console.log(err.text);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
