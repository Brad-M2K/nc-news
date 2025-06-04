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

  if (isNaN(article_id)) {
    return next({ status: 400, msg: "Invalid article ID" });
  }

  try {
    const article = await selectArticleById(article_id);
    if (!article) {
      return next({ status: 404, msg: "Article not found" });
    }
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
