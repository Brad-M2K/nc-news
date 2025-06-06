const db = require("../db/connection");

exports.selectArticles = async (sort_by = "created_at", order = "desc") => {
  const validSortColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrders = ["asc", "desc"];

  if (!validSortColumns.includes(sort_by) || !validOrders.includes(order))
    throw { status: 400, msg: "Bad request" };

  const { rows } = await db.query(
    `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};
    `
  );
  return rows;
};

exports.selectArticleById = async (article_id) => {
  const { rows } = await db.query(
    `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.body, COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
    `,
    [article_id]
  );
  const article = rows[0];

  return article;
};

exports.updateArticleVotesById = async (article_id, inc_votes = 0) => {
  const { rows } = await db.query(
    `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `,
    [inc_votes, article_id]
  );
  const updatedArticle = rows[0];

  return updatedArticle;
};
