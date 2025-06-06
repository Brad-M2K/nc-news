const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, getArticleIdByTitle } = require("./utils");

const seed = async ({
  topicsData,
  usersData,
  articlesData,
  commentsData,
  emojisData,
  emojiArticleUsersData,
  userTopicsData,
  userArticleVotesData,
  bookmarksData,
  commentReactionsData,
  notificationsData,
  privateMessagesData,
  articleViewsData,
  pollsData,
  pollVotesData,
  userCommentVotesData,
  pollOptionsData,
}) => {
  // ! DROP tables if they exist — ensures a clean slate
  await db.query(`
    DROP TABLE IF EXISTS poll_votes, poll_options, polls, article_views, private_messages, notifications, comment_reactions, bookmarks, user_article_votes, user_comment_votes, user_topic, emoji_article_user, comments, articles, emojis, users, topics CASCADE;
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
    body TEXT NOT NULL,
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

  // * Create bookmarks table
  await db.query(`
CREATE TABLE bookmarks (
  bookmark_id SERIAL PRIMARY KEY,
  username VARCHAR REFERENCES users(username),
  article_id INT REFERENCES articles(article_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (username, article_id)
);
`);

  //* Create comment_reactions table
  await db.query(`
    CREATE TABLE comment_reactions (
      reaction_id SERIAL PRIMARY KEY,
      emoji_id INT REFERENCES emojis(emoji_id),
      username VARCHAR REFERENCES users(username),
      comment_id INT REFERENCES comments(comment_id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (emoji_id, username, comment_id)
    );
  `);

  //* Create notifications table
  await db.query(`
    CREATE TABLE notifications (
      notification_id SERIAL PRIMARY KEY,
      username VARCHAR REFERENCES users(username),
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //* Create private_messages table
  await db.query(`
    CREATE TABLE private_messages (
      message_id SERIAL PRIMARY KEY,
      sender_username VARCHAR REFERENCES users(username),
      recipient_username VARCHAR REFERENCES users(username),
      message TEXT NOT NULL,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //* Create article views table
  await db.query(`
    CREATE TABLE article_views (
      article_view_id SERIAL PRIMARY KEY,
      username VARCHAR REFERENCES users(username),
      article_id INT REFERENCES articles(article_id),
      view_count INT DEFAULT 1,
      last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (username, article_id)
    );
  `);

  //* Create polls table
  await db.query(`
    CREATE TABLE polls (
      poll_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      question TEXT NOT NULL
    );
  `);

  //* Create poll_options table
  await db.query(`
    CREATE TABLE poll_options (
      option_id SERIAL PRIMARY KEY,
      poll_id INT REFERENCES polls(poll_id) ON DELETE CASCADE,
      option_text TEXT NOT NULL,
      created_by VARCHAR REFERENCES users(username) NOT NULL
    );
  `);

  //* Create poll Votes table
  await db.query(`
    CREATE TABLE poll_votes (
      poll_vote_id SERIAL PRIMARY KEY,
      poll_id INT REFERENCES polls(poll_id),
      username VARCHAR REFERENCES users(username),
      choice TEXT NOT NULL,
      UNIQUE (poll_id, username)
    );
  `);

  //* Create user comment votes table
  await db.query(`
    CREATE TABLE user_comment_votes (
      user_comment_votes_id SERIAL PRIMARY KEY,
      username VARCHAR REFERENCES users(username),
      comment_id INT REFERENCES comments(comment_id),
      vote_count INT NOT NULL,
      UNIQUE (username, comment_id)
    );
  `);

  // * INSERT data into tables
  // * Insert topic data
  const topicInsertQuery = format(
    `
    INSERT INTO topics (slug, description, img_url)
    VALUES %L;
  `,
    topicsData.map(({ slug, description, img_url }) => [
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
    usersData.map(({ username, name, avatar_url }) => [
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
    articlesData.map((article) => {
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
    commentsData.map((comment) => {
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
    emojisData.map(({ emoji }) => [emoji])
  );
  await db.query(emojisInsertQuery);
  //* Insert emoji user article data
  const emojiArticleUserDataInsertQuery = format(
    `
    INSERT INTO emoji_article_user(emoji_id, username, article_id)
    VALUES %L;
  `,
    emojiArticleUsersData.map(({ emoji_id, username, article_id }) => [
      emoji_id,
      username,
      article_id,
    ])
  );
  await db.query(emojiArticleUserDataInsertQuery);

  //* Insert user topic Data
  const userTopicDataInsertQuery = format(
    `
    INSERT INTO user_topic (username, topic)
    VALUES %L;
  `,
    userTopicsData.map(({ username, topic }) => [username, topic])
  );
  await db.query(userTopicDataInsertQuery);

  //* Insert user article votes data
  const userArticleVotesDataInsertQuery = format(
    `
    INSERT INTO user_article_votes (username, article_id, vote_count)
    VALUES %L;
  `,
    userArticleVotesData.map(({ username, article_id, vote_count }) => [
      username,
      article_id,
      vote_count,
    ])
  );
  await db.query(userArticleVotesDataInsertQuery);

  //* Insert bookmark data
  const bookmarksInsertQuery = format(
    `
    INSERT INTO bookmarks (username, article_id)
    VALUES %L;
    `,
    bookmarksData.map(({ username, article_id }) => [username, article_id])
  );
  await db.query(bookmarksInsertQuery);

  //* Insert comment reactions data
  const commentReactionsInsertQuery = format(
    `
    INSERT INTO comment_reactions (emoji_id, username, comment_id)
    VALUES %L;
    `,
    commentReactionsData.map(({ emoji_id, username, comment_id }) => [
      emoji_id,
      username,
      comment_id,
    ])
  );
  await db.query(commentReactionsInsertQuery);

  //* Insert notification data
  const notificationInsertQuery = format(
    `
    INSERT INTO notifications (username, message, is_read)
    VALUES %L;
  `,
    notificationsData.map(({ username, message, is_read }) => [
      username,
      message,
      is_read,
    ])
  );
  await db.query(notificationInsertQuery);

  //* Insert private messages data
  const privateMessagesInsertQuery = format(
    `
    INSERT INTO private_messages (sender_username, recipient_username, message)
    VALUES %L;
  `,
    privateMessagesData.map(
      ({ sender_username, recipient_username, message }) => [
        sender_username,
        recipient_username,
        message,
      ]
    )
  );
  await db.query(privateMessagesInsertQuery);

  //* Insert article views data
  const articleViewsInsertQuery = format(
    `
    INSERT INTO article_views (username, article_id, view_count, last_viewed)
    VALUES %L;
  `,
    articleViewsData.map(
      ({ username, article_id, view_count, last_viewed }) => [
        username,
        article_id,
        view_count,
        last_viewed,
      ]
    )
  );
  await db.query(articleViewsInsertQuery);

  //* Insert polls data
  const pollsInsertQuery = format(
    `
    INSERT INTO polls (article_id, question)
    VALUES %L;
  `,
    pollsData.map(({ article_id, question }) => [article_id, question])
  );
  await db.query(pollsInsertQuery);

  //* Insert poll options data
  const pollOptionsInsertQuery = format(
    `
    INSERT INTO poll_options (poll_id, option_text, created_by)
    VALUES %L;
  `,
    pollOptionsData.map(({ poll_id, option_text, created_by }) => [
      poll_id,
      option_text,
      created_by,
    ])
  );
  await db.query(pollOptionsInsertQuery);

  //* Insert poll votes data
  const pollVotesInsertQuery = format(
    `
    INSERT INTO poll_votes (poll_id, username, choice)
    VALUES %L;
  `,
    pollVotesData.map(({ poll_id, username, choice }) => [
      poll_id,
      username,
      choice,
    ])
  );
  await db.query(pollVotesInsertQuery);

  //* Insert user comment votes data
  const userCommentVotesInsertQuery = format(
    `
    INSERT INTO user_comment_votes (username, comment_id, vote_count)
    VALUES %L;
  `,
    userCommentVotesData.map(({ username, comment_id, vote_count }) => [
      username,
      comment_id,
      vote_count,
    ])
  );
  await db.query(userCommentVotesInsertQuery);
};

console.log("Database seeded successfully!");

module.exports = seed;
