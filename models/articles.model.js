const db = require("../db/connection");

//* Selects all articles from the database, including the count of comments for each article.
//* The articles are ordered by creation date in descending order.
//* Leaves out the body of the articles for a brief overview.
exports.selectArticles = async () => {
  const { rows } = await db.query(
    `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
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
  if (!article) {
    throw { status: 404, msg: "Article not found" };
  }
  return article;
};
