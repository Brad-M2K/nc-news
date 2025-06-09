const express = require("express");
const {
  getArticles,
  getArticleById,
  patchArticleVotesById,
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require("../controllers/index");
const { commentsRouter } = require("./index.js");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.patch("/:article_id", patchArticleVotesById);

// Nested comments endpoints
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postCommentsByArticleId);

module.exports = articlesRouter;
