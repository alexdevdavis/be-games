const db = require("../db/connection");
const format = require("pg-format");
const { fetchAllUsers } = require("./users.model");

exports.fetchAllReviews = async (
  sort_by = "created_at",
  order_by = "DESC",
  category
) => {
  const valuesArr = [];
  //VALIDATE SORT_BY
  const validSorts = await db.query(
    `SELECT column_name FROM INFORMATION_SCHEMA. COLUMNS WHERE TABLE_NAME = 'reviews'`
  );
  const headerArray = validSorts.rows.map((element) => element.column_name);

  if (!headerArray.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "invalid sort by request" });
  }

  let queryStr = `SELECT reviews.owner, title, 
  reviews.review_id, category, review_img_url, 
  reviews.created_at, reviews.votes, 
  COUNT(comments.review_id) ::INT AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id `;

  //VALIDATE CATEGORY
  if (category) {
    if (!isNaN(category)) {
      return Promise.reject({
        status: 400,
        message: "invalid category request",
      });
    }
    const categoryCheck = await db.query(`SELECT slug FROM categories`);
    const categories = categoryCheck.rows.map((element) => element.slug);
    if (!categories.includes(category)) {
      return Promise.reject({ status: 404, message: "category not found" });
    }
    queryStr += `WHERE category = $1`;
    valuesArr.push(category);
  }

  queryStr += `GROUP BY reviews.review_id 
    ORDER BY reviews.${sort_by}`;

  //VALIDATE ORDER_BY
  if (!["ASC", "DESC"].includes(order_by.toUpperCase())) {
    return Promise.reject({ status: 400, message: "invalid order by request" });
  }
  queryStr += `${order_by}`;

  const allReviews = await db.query(queryStr, valuesArr);
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
    return Promise.reject({ status: 404, message: "review not found" });
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
  if (isNaN(review_id)) {
    return Promise.reject({
      status: 400,
      message: "invalid review id request",
    });
  }
  await this.fetchReviewById(review_id);
  const reviewComments = await db.query(
    `SELECT * FROM comments WHERE review_id = $1`,
    [review_id]
  );
  return reviewComments.rows;
};

exports.insertCommentByReviewId = async (review_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message: "invalid comment",
    });
  }
  await this.fetchReviewById(review_id);

  const userArray = await fetchAllUsers();
  if (!userArray.find((user) => user.username === username)) {
    return Promise.reject({
      status: 404,
      message: "user not found",
    });
  }
  const nestedArr = [[review_id, username, body]];
  const formattedQuery = format(
    `INSERT INTO comments 
    (review_id, author, body) 
    VALUES 
    %L
    RETURNING *`,
    nestedArr
  );
  const postedComment = await db.query(formattedQuery);
  return postedComment.rows[0];
};
