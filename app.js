const express = require("express");
const {
  getApi,
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
} = require("./controllers");
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

//*User Endpoints
// gets list of all users
app.get("/api/users", getUsers);

// ✨ Custom error-handling middleware
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.error(err); // Optional: for debugging unknown errors
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
