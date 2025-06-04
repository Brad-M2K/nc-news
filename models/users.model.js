const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    console.log("🚀 ~ returndb.query ~ rows:", rows);
    return rows;
  });
};
