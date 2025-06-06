const { sort } = require("../db/data/test-data/articles");
const {
  selectArticles,
  selectArticleById,
  updateArticleVotesById,
} = require("../models");
const { checkArticleExists, ensurePresent } = require("../utils");

exports.getArticles = async (req, res, next) => {
  const { sort_by, order } = req.query;
  try {
    const articles = await selectArticles(sort_by, order);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    await checkArticleExists(article_id);
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleVotesById = async (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  try {
    await ensurePresent(inc_votes);
    await checkArticleExists(article_id);
    const updatedArticle = await updateArticleVotesById(article_id, inc_votes);
    res.status(200).send({ article: updatedArticle });
  } catch (err) {
    next(err);
  }
};
