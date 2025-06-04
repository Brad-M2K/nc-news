const { getApi } = require("./api.controller");
const { getTopics } = require("./topics.controller");
const { getArticles } = require("./articles.controller");
const { getUsers } = require("./users.controller");

module.exports = {
  getApi,
  getTopics,
  getArticles,
  getUsers,
};
