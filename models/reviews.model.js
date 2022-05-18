const db = require("../db/connection");

exports.fetchAllReviews = async () => {
  let queryStr = `SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id) ::INT AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC
  `;

  const allReviews = await db.query(queryStr);
  return allReviews.rows;
};

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

exports.fetchCommentsByReviewId = async (review_id) => {
  const reviewComments = await db.query(
    `SELECT * FROM comments WHERE review_id = $1`,
    [review_id]
  );
  return reviewComments.rows;
};
