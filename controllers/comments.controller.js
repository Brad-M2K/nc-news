const { selectCommentsByArticleId, selectArticleById } = require("../models");
const checkArticleId = selectArticleById;

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const isValid = checkArticleId(article_id);

  try {
    await isValid;

    const comments = await selectCommentsByArticleId(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
