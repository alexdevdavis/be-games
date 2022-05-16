const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    }
    return response.rows;
  });
};

exports.fetchReviewById = (review_id) => {
  if (parseInt(review_id) === NaN) {
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
