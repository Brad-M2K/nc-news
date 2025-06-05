const express = require("express");
const {
  getApi,
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
  getCommentsByArticleId,
} = require("./controllers");
const { psqlErrors, customErrors, serverErrors } = require("./error-handling");

const app = express();

//* gets the endpoints.json
app.get("/api", getApi);

//* Topic Endpoints
// gets list of all topics
app.get("/api/topics", getTopics);

//* Article Endpoints
// gets list of all articles including comment count and excluding body for breif overview
app.get("/api/articles", getArticles);
// gets a specific article by id including comment count and body
app.get("/api/articles/:article_id", getArticleById);

//* Comments Endpoints
// gets all comments for an artcile by id
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

//*User Endpoints
// gets list of all users
app.get("/api/users", getUsers);

//! ✨ Error-handling middleware
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
