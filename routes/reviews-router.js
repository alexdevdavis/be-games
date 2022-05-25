const reviewsRouter = require("express").Router();

const {
  getAllReviews,
  getReviewById,
  getCommentsByReviewId,
  patchReviewVotesById,
  postCommentByReviewId,
} = require("../controllers/reviews.controller");
