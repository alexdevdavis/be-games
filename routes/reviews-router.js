const reviewsRouter = require("express").Router();

const {
  getAllReviews,
  getReviewById,
  getCommentsByReviewId,
  patchReviewVotesById,
  postCommentByReviewId,
} = require("../controllers/reviews.controller");

reviewsRouter.get("/", getAllReviews);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewVotesById);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentByReviewId);

module.exports = reviewsRouter;
