const { getApi } = require("./api.controller");
const { getTopics } = require("./topics.controller");
const { getArticles } = require("./articles.controller");
const { getUsers } = require("./users.controller");
const { getArticleById } = require("./articles.controller");

module.exports = {
  getApi,
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
};
