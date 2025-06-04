const express = require("express");
const { getApi, getTopics, getArticles } = require("./controllers");
const app = express();

//* gets the endpoints.json
app.get("/api", getApi);
//* gets list of all topics
app.get("/api/topics", getTopics);
//* gets list of all articles including comment count and excluding body for breif overview
app.get("/api/articles", getArticles);

module.exports = app;
