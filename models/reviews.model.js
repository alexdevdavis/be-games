const db = require("../db/connection");

exports.fetchReviewById = async (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  const reviewWithComments = await db.query(
    `SELECT reviews.* , 
    COUNT(comments.review_id)::INT AS comment_count 
    FROM reviews  
    LEFT JOIN comments 
    ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1 
    GROUP BY reviews.review_id`,
    [review_id]
  );
  const returnedReview = reviewWithComments.rows[0];

  if (!returnedReview) {
    return Promise.reject({ status: 404, message: "no such review" });
  }
  return reviewWithComments.rows[0];
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
