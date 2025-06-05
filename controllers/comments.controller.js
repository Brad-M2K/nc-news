const {
  selectCommentsByArticleId,
  insertComment,
  insertCommentByArticleId,
} = require("../models");
const { checkArticleExists, checkUserExists } = require("../utils");

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    await checkArticleExists(article_id);
    const comments = await selectCommentsByArticleId(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  try {
    await checkArticleExists(article_id);
    await checkUserExists(username);
    const newComment = await insertCommentByArticleId(
      article_id,
      username,
      body
    );
    res.status(201).send({ comment: newComment });
  } catch (err) {
    next(err);
  }
};
