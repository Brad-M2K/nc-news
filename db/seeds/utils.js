const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.getArticleIdByTitle = (title, articleArray) => {
  const foundArticle = articleArray.find((article) => article.title === title);
  return foundArticle ? foundArticle.article_id : undefined;
};
