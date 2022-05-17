const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    }
    return response.rows;
  });
};
