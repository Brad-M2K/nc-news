const {
  selectArticles,
  selectArticleById,
} = require("../models/articles.model");

exports.getArticles = async (req, res, next) => {
  try {
    const articles = await selectArticles();
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
