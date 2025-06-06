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

exports.removeCommentById = async (comment_id) => {
  const { rowCount } = await db.query(
    `
        DELETE FROM comments
        WHERE comment_id = $1;
    `,
    [comment_id]
  );

  if (rowCount === 0) {
    throw { status: 404, msg: "Comment not found" };
  }
};
