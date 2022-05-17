const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
  const id = parseInt(review_id);

  if (!id) {
    return Promise.reject({ status: 400, message: "bad request" });
  } else {
    return db
      .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
      .then((review) => {
        if (review.rows.length === 0) {
          return Promise.reject({ status: 404, message: "not found" });
        }

        return review.rows[0];
      });
  }
};

exports.updateReviewVotesById = (review_id, inc_votes) => {
  let queryStr = `UPDATE reviews SET votes = votes + ${inc_votes} `;

  queryStr += `WHERE review_id = $1 RETURNING *`;

  return db.query(queryStr, [review_id]).then((review) => {
    return review.rows[0];
  });
};
