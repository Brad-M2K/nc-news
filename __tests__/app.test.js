const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object with teh key of topics and the value of an array of topic objects; each including slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(body).toHaveProperty("topics");
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);

        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("img_url");
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects, each including the keys: author, title, article_id, topic, created_at, votes, and comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(body).toHaveProperty("articles");
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(13);

        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});

// describe("GET /api/users", () => {
//   test("200: Responds with an object with a key of users with a value of an array of user objects, each including the keys: username, avatar_url, and name", () => {
//     return request(app)
//       .get("/api/users")
//       .expect(200)
//       .then(({ body }) => {
//         const { users } = body;

//         expect(body).toHaveProperty("users");
//         expect(users).toBeInstanceOf(Array);
//         expect(users).toHaveLength(4);

//         users.forEach((user) => {
//           expect(user).toHaveProperty("username");
//           expect(user).toHaveProperty("avatar_url");
//           expect(user).toHaveProperty("name");
//         });
//       });
//   });
// });
