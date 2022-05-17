const {
  fetchReviewById,
  updateReviewVotesById,
} = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewVotesById(review_id, inc_votes)
    .then((updated_review) => {
      res.status(200).send({ updated_review });
    })
    .catch(next);
};
