const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, getArticleIdByTitle } = require("./utils");

const seed = async ({
  topicData,
  userData,
  articleData,
  commentData,
  emojiData,
  emojiArticleUserData,
}) => {
  // ! DROP tables if they exist — ensures a clean slate
  await db.query(`
     DROP TABLE IF EXISTS comments, articles, users, topics, emojis, emoji_article_user, user_topic, user_article_votes;
  `);
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
  //* Create emojis table
  await db.query(`
   CREATE TABLE emojis (
   emoji_id SERIAL PRIMARY KEY,
   emoji VARCHAR NOT NULL
   );
`);
  //* Create emoji_article_user table
  await db.query(`
   CREATE TABLE emoji_article_user (
   emoji_article_user_id SERIAL PRIMARY KEY,
   emoji_id INT REFERENCES emojis(emoji_id),
   username VARCHAR REFERENCES users(username),
   article_id INT REFERENCES articles(article_id),
   UNIQUE (emoji_id, username, article_id)
   );
  `);

  //* Create user topic table
  await db.query(`
    CREATE TABLE user_topic (
    user_topic_id SERIAL PRIMARY KEY,
    username VARCHAR REFERENCES users(username),
    topic VARCHAR REFERENCES topics(slug),
    UNIQUE (username, topic)
    );
  `);

  //* Create user article votes table
  await db.query(`
    CREATE TABLE user_article_votes (
    user_article_votes_id SERIAL PRIMARY KEY,
    username VARCHAR REFERENCES users(username),
    article_id INT REFERENCES articles(article_id),
    vote_count INT NOT NULL,
    UNIQUE (username, article_id)
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

  //* Insert emoji data
  const emojisInsertQuery = format(
    `
     INSERT INTO emojis (emoji)
     VALUES %L;
  `,
    emojiData.map(({ emoji }) => [emoji])
  );
  await db.query(emojisInsertQuery);
  //* Insert emoji user article data
  const emojiArticleUserDataInsertQuery = format(
    `
     INSERT INTO emoji_article_user(emoji_id, username, article_id)
     VALUES %L;
  `,
    emojiArticleUserData.map(({ emoji_id, username, article_id }) => [
      emoji_id,
      username,
      article_id,
    ])
  );
  await db.query(emojiArticleUserDataInsertQuery);
};

module.exports = seed;
