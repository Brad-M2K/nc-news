const express = require("express");
const {
  getApi,
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require("./controllers");
const {
  psqlErrors,
  customErrors,
  serverErrors,
} = require("./error-middlewear");

const app = express();

//? ✨ Middleware for parsing JSON
app.use(express.json());

//* ENDPOINTS API JSON
app.get("/api", getApi);

//* TOPIC ENDPOINTS
//* GET
// gets list of all topics
app.get("/api/topics", getTopics);

//* ARTICLE ENDPOINTS
//* GET
// gets list of all articles with author, title, article_id, topic, created_at, votes and comment_count
// gets list of all articles including comment count and excluding body for breif overview
app.get("/api/articles", getArticles);
// gets a specific article by id including comment count and body
app.get("/api/articles/:article_id", getArticleById);

//* COMMENT ENDPOINTS
//* GET
// gets all comments for an article by id
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
//* POST
// adds a comment to an article by id
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

//* USER ENDPOINTS
//* GET
// gets list of all users
app.get("/api/users", getUsers);

//! ✨ Error-handling middleware
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
