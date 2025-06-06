module.exports = {
  selectTopics: require("./topics.model").selectTopics,
  selectUsers: require("./users.model").selectUsers,
  selectArticles: require("./articles.model").selectArticles,
  selectArticleById: require("./articles.model").selectArticleById,
  selectCommentsByArticleId:
    require("./comments.model").selectCommentsByArticleId,
  insertCommentByArticleId:
    require("./comments.model").insertCommentByArticleId,
  updateArticleVotesById: require("./articles.model").updateArticleVotesById,
};
