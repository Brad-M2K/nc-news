const db = require("../db/connection");

exports.checkTopicExists = async (topic) => {
  if (topic === null) return;
  if (topic) {
    const topicExists = await db.query(`SELECT * FROM topics WHERE slug = $1`, [
      topic,
    ]);
    if (topicExists.rows.length === 0) {
      throw { status: 400, msg: "Bad request" };
    }
  }
  return topic;
};
