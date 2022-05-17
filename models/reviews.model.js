const db = require("../db/connection");

exports.fetchReviewById = async (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  const reviewComments = await db.query(
    `SELECT * FROM comments WHERE review_id = $1`,
    [review_id]
  );
  const queryReview = await db.query(
    `SELECT * FROM reviews WHERE review_id = $1`,
    [review_id]
  );

  if (queryReview.rows.length === 0) {
    return Promise.reject({ status: 404, message: "no such review" });
  }
  const returnedReview = queryReview.rows[0];
  returnedReview.comment_count = reviewComments.rows.length;

  return returnedReview;
};

exports.updateReviewVotesById = async (review_id, inc_votes) => {
  await this.fetchReviewById(review_id);
  if (isNaN(inc_votes)) {
    return Promise.reject({ status: 400, message: "invalid vote request" });
  }
  let queryStr = `UPDATE reviews 
  SET votes = votes + ${inc_votes} 
  WHERE review_id = $1 RETURNING *`;

  const updatedReview = await db.query(queryStr, [review_id]);
  return updatedReview.rows[0];
};
