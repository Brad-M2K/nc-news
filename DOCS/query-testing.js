const db = require("../db/connection");

// //? show me all users
// db.query(`SELECT * FROM users;`).then((result) => {
//   console.log("🚀 ~ .then ~ result:", result.rows);
// });

// //? show me all articles where the topic is coding
// db.query(`SELECT * FROM articles WHERE topic = 'coding';`).then((result) => {
//   console.log("🚀 ~ .then ~ result:", result.rows);
// });

// //? show me all comments with votes less than 0
// db.query(`SELECT * FROM comments WHERE votes < 0;`).then((result) => {
//   console.log("🚀 ~ db.query ~ result:", result.rows);
// });

// //? show me all topics
// db.query(`SELECT * FROM topics;`).then((result) => {
//   console.log("🚀 ~ db.query ~ result:", result.rows);
// });

// //? show me all articles by user grumpy19
// db.query(`SELECT * FROM articles WHERE author = 'grumpy19';`).then((Result) => {
//   console.log("🚀 ~ db.query ~ Result:", Result.rows);
// });

// //? show me all comments that have more than 10 votes
// db.query(`SELECT * FROM comments WHERE votes > 10;`).then((result) => {
//   console.log("🚀 ~ db.query ~ result:", result.rows);
// });

// //? show me all emojis
// db.query(`SELECT * FROM emojis;`).then((result) => {
//   console.log("🚀 ~ db.query ~ result:", result.rows);
// });

// //? show me all emoji_article_user records
// db.query(`SELECT * FROM emoji_article_user;`).then((result) => {
//   console.log("🚀 ~ db.query ~ result:", result.rows);
// });

//? show me
