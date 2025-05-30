-- Schema representation for nc_news project in raw SQL

DROP TABLE IF EXISTS emoji_article_user, emojis, comments, articles, topics, users;

CREATE TABLE users (
  username TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT
);

CREATE TABLE topics (
  slug TEXT PRIMARY KEY,
  description TEXT NOT NULL
);

CREATE TABLE articles (
  article_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  votes INT DEFAULT 0,
  topic TEXT NOT NULL REFERENCES topics(slug),
  author TEXT NOT NULL REFERENCES users(username),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  author TEXT NOT NULL REFERENCES users(username),
  article_id INT NOT NULL REFERENCES articles(article_id),
  votes INT DEFAULT 0,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emojis (
  emoji_id SERIAL PRIMARY KEY,
  emoji VARCHAR NOT NULL
);

CREATE TABLE emoji_article_user (
  emoji_article_user_id SERIAL PRIMARY KEY,
  emoji_id INT REFERENCES emojis(emoji_id),
  username VARCHAR REFERENCES users(username),
  article_id INT REFERENCES articles(article_id)
);

-- Sample insertions for language weight
INSERT INTO users (username, name, avatar_url) VALUES ('grumpy19', 'Paul Grump', 'http://avatar.url/grumpy.png');

INSERT INTO topics (slug, description) VALUES ('coding', 'Code is love, code is life');

INSERT INTO articles (title, body, topic, author) VALUES (
  '10 Tips for Clean Code',
  'Always use meaningful variable names...',
  'coding',
  'grumpy19'
);

INSERT INTO comments (author, article_id, votes, body) VALUES (
  'grumpy19', 1, 3, 'Great advice, thanks!'
);

INSERT INTO emojis (emoji) VALUES ('🔥');

INSERT INTO emoji_article_user (emoji_id, username, article_id) VALUES (1, 'grumpy19', 1);