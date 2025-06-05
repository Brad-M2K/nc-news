const db = require("../db/connection.js");

exports.selectCommentsByArticleId = async (article_id) => {
  const { rows: comments } = await db.query(
    `
        SELECT comments.comment_id, comments.author, comments.article_id, comments.votes, comments.created_at, comments.body
        FROM comments
        WHERE article_id = $1
        ORDER BY comments.created_at DESC;
    `,
    [article_id]
  );

  return comments;
};

exports.insertCommentByArticleId = async (article_id, username, body) => {
  const { rows: comment } = await db.query(
    `
        INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;
    `,
    [article_id, username, body]
  );

  return comment[0];
};
