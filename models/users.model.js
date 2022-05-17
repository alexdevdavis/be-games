const db = require("../db/connection");

exports.fetchAllUsers = async () => {
  const users = await db.query(`SELECT * FROM users`);
  return users.rows;
};
