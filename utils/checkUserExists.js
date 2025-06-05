const db = require("../db/connection");

exports.checkUserExists = async (username) => {
  const result = await db.query(`SELECT * FROM users WHERE username = $1;`, [
    username,
  ]);
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }
};
