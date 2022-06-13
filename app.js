const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const { getAllUsers } = require("./controllers/users.controller");
const {
  getAllReviews,
  getReviewById,
  patchReviewVotesById,
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("./controllers/reviews.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");

// require API router
const apiRouter = require("./routes/api-router");

// use api router for all endpoints beginning with '/api'
app.use("/api", apiRouter);

//CATEGORIES

//REVIEWS
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchReviewVotesById);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

//USERS
app.get("/api/users", getAllUsers);

//COMMENTS
app.delete("/api/comments/:comment_id", deleteCommentById);

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
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = { app };
