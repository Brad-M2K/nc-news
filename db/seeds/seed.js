const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, getArticleIdByTitle } = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // ! DROP tables if they exist — ensures a clean slate
  await db.query("DROP TABLE IF EXISTS comments, articles, users, topics;");
  // * CREATE ALL NECESSARY TABLES FOR SEEDING
  // * Create topics table
  await db.query(`
    CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR NOT NULL,
    img_url VARCHAR(1000)
    );
  `);
  // * Create users table
  await db.query(`
    CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR,
    avatar_url VARCHAR(1000)
    );
  `);
  // * Create articles table
  await db.query(`
    CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR,
    topic VARCHAR REFERENCES topics(slug) ON DELETE CASCADE,
    author VARCHAR REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
    );
  `);
  // * Create comments table
  await db.query(`
    CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id SERIAL REFERENCES articles(article_id),
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // * INSERT data into tables
  // * Insert topic data
  const topicInsertQuery = format(
    `
     INSERT INTO topics (slug, description, img_url)
    VALUES %L;
  `,
    topicData.map(({ slug, description, img_url }) => [
      slug,
      description,
      img_url,
    ])
  );

  await db.query(topicInsertQuery);

  // * Insert user data
  const userInsertQuery = format(
    `
    INSERT INTO users (username, name, avatar_url)
    VALUES %L;
  `,
    userData.map(({ username, name, avatar_url }) => [
      username,
      name,
      avatar_url,
    ])
  );

  await db.query(userInsertQuery);

  // * Insert article data (with converted timestamps)
  const articleInsertQuery = format(
    `
     INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
     VALUES %L;
  `,
    articleData.map((article) => {
      const convertedTimestamp = convertTimestampToDate(article);
      const { title, topic, author, body, created_at, votes, article_img_url } =
        convertedTimestamp;
      return [title, topic, author, body, created_at, votes, article_img_url];
    })
  );

  await db.query(articleInsertQuery);

  // * Insert comment data (after mapping titles to IDs and converting timestamps)
  //* selected articles to use in insert query
  const articlesQueryResult = await db.query(
    `SELECT article_id, title FROM articles;`
  );
  const articles = articlesQueryResult.rows;

  const commentInsertQuery = format(
    `
     INSERT INTO comments (article_id, body, votes, author, created_at)
     VALUES %L;
  `,
    commentData.map((comment) => {
      const article_id = getArticleIdByTitle(comment.article_title, articles);
      const withConvertedTimestamp = convertTimestampToDate(comment);
      const { body, votes, author, created_at } = withConvertedTimestamp;
      return [article_id, body, votes, author, created_at];
    })
  );
  await db.query(commentInsertQuery);
};
module.exports = seed;
