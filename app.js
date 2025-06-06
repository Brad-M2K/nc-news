const express = require("express");
const {
  getApi,
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
  getCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleVotesById,
  deleteCommentById,
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

//* TOPICS
//* GET
// gets list of all topics
app.get("/api/topics", getTopics);

//* ARTICLES
//* GET
// gets list of all articles with author, title, article_id, topic, created_at, votes and comment_count - no body as this is  a list view
app.get("/api/articles", getArticles);
// gets a specific article by id including comment count and body
app.get("/api/articles/:article_id", getArticleById);
//* PATCH
// updates the votes of an article by id
app.patch("/api/articles/:article_id", patchArticleVotesById);

//* COMMENTS
//* GET
// gets all comments for an article by id
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
//* POST
// adds a comment to an article by id
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);
//* DELETE
// deletes a comment by id
app.delete("/api/comments/:comment_id", deleteCommentById);

//* USERS
//* GET
// gets list of all users
app.get("/api/users", getUsers);

//! ✨ Error-handling middleware
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
