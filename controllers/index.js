const { post } = require("../app");

module.exports = {
  getApi: require("./api.controller").getApi,
  getTopics: require("./topics.controller").getTopics,
  getUsers: require("./users.controller").getUsers,
  getArticles: require("./articles.controller").getArticles,
  getArticleById: require("./articles.controller").getArticleById,
  patchArticleVotesById: require("./articles.controller").patchArticleVotesById,
  getCommentsByArticleId: require("./comments.controller")
    .getCommentsByArticleId,
  postCommentsByArticleId: require("./comments.controller")
    .postCommentsByArticleId,
  deleteCommentById: require("./comments.controller").deleteCommentById,
};
