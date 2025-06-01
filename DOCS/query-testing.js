const db = require("../db/connection");

//? show me all users
db.query(`SELECT * FROM users;`).then((result) => {
  console.log("🚀 ~ .then ~ result:", result.rows);
});

//? show me all articles where the topic is coding
db.query(`SELECT * FROM articles WHERE topic = 'coding';`).then((result) => {
  console.log("🚀 ~ .then ~ result:", result.rows);
});

//? show me all comments with votes less than 0
db.query(`SELECT * FROM comments WHERE votes < 0;`).then((result) => {
  console.log("🚀 ~ db.query ~ result:", result.rows);
});

//? show me all topics
db.query(`SELECT * FROM topics;`).then((result) => {
  console.log("🚀 ~ db.query ~ result:", result.rows);
});

//? show me all articles by user grumpy19
db.query(`SELECT * FROM articles WHERE author = 'grumpy19';`).then((Result) => {
  console.log("🚀 ~ db.query ~ Result:", Result.rows);
});

//? show me all comments that have more than 10 votes
db.query(`SELECT * FROM comments WHERE votes > 10;`).then((result) => {
  console.log("🚀 ~ db.query ~ result:", result.rows);
});

//? show me all emojis
db.query(`SELECT * FROM emojis;`).then((result) => {
  console.log("🚀 ~ db.query ~ result:", result.rows);
});

//? show me all emoji_article_user recordss
db.query(`SELECT * FROM emoji_article_user;`).then((result) => {
  console.log("🚀 ~ db.query ~ result:", result.rows);
});

//? show me all emoji_article_user records
db.query(`SELECT * FROM emoji_article_user;`).then((result) => {
  console.log("🚀 ~ db.query ~ result:", result.rows);
});

//? show me all user_topic records
db.query(`SELECT * FROM user_topic;`).then((result) => {
  console.log("🚀 ~ db.query ~ result:", result.rows);
});

//? show me all user_article_votes records
db.query(`SELECT * FROM user_article_votes;`).then((result) => {
  console.log("🚀 ~ db.query ~ result:", result.rows);
});

//? Get article reactions with emoji symbol, user, and article title
db.query(
  `
  SELECT
    emoji_article_user.username,
    emojis.emoji,
    articles.title AS article_title
  FROM emoji_article_user
  JOIN emojis ON emoji_article_user.emoji_id = emojis.emoji_id
  JOIN articles ON emoji_article_user.article_id = articles.article_id;
`
).then((result) => {
  console.log("🚀 ~ Reactions joined data:", result.rows);
});

//? Show who bookmarked which article and when
db.query(
  `
  SELECT
    bookmarks.username,
    articles.title AS article_title,
    bookmarks.created_at
  FROM bookmarks
  JOIN articles ON bookmarks.article_id = articles.article_id;
`
).then((result) => {
  console.log("🚀 ~ Bookmarks joined data:", result.rows);
});

// ? show me all comment reactions with emoji, user and comment text
db.query(
  `
  SELECT 
    comment_reactions.username,
    emojis.emoji,
    comments.body AS comment_body,
    comment_reactions.created_at
  FROM comment_reactions
  JOIN emojis ON comment_reactions.emoji_id = emojis.emoji_id
  JOIN comments ON comment_reactions.comment_id = comments.comment_id;
`
).then((result) => {
  console.log("🚀 ~ Comment Reactions Joined Data:", result.rows);
});
