const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", async () => {
    const {
      body: { endpoints },
    } = await request(app).get("/api").expect(200);
    expect(endpoints).toEqual(endpointsJson);
  });
});
describe("Topics Endpoints", () => {
  describe("GET /api/topics", () => {
    test("200: Responds with an object with teh key of topics and the value of an array of topic objects; each including slug and description", async () => {
      const { body } = await request(app).get("/api/topics").expect(200);
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

describe("Articles Endpoints", () => {
  describe("GET /api/articles", () => {
    test("200: Responds with an array of article objects, each including the keys: author, title, article_id, topic, created_at, votes, and comment_count", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
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
        expect(article).toHaveProperty("article_img_url");
      });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("200: Responds with an article object including the keys: author, title, article_id, topic, created_at, votes, body, and comment_count", async () => {
      const { body } = await request(app).get("/api/articles/1").expect(200);
      const { article } = body;

      expect(body).toHaveProperty("article");
      expect(article).toHaveProperty("author");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("article_id");
      expect(article).toHaveProperty("topic");
      expect(article).toHaveProperty("created_at");
      expect(article).toHaveProperty("votes");
      expect(article).toHaveProperty("body");
      expect(article).toHaveProperty("comment_count");
      expect(article).toHaveProperty("article_img_url");
    });

    test("404: Responds with an error message when given a valid but non-existent article_id", async () => {
      const { body } = await request(app).get("/api/articles/9999").expect(404);
      expect(body.msg).toBe("Article not found");
    });

    test("400: Responds with an error message when given an invalid article_id", async () => {
      const { body } = await request(app)
        .get("/api/articles/invalid-id")
        .expect(400);
      expect(body.msg).toBe("Bad request");
    });
  });

  describe("PATCH - /api/articles/:article_id", () => {
    describe("PATCH - /api/article/article_id", () => {
      test("200: responds with the updated article object including correct keys and votes incremented properly", async () => {
        const incrementVotes = { inc_votes: 5 };

        const { body } = await request(app)
          .patch("/api/articles/1")
          .send(incrementVotes)
          .expect(200);

        const { article } = body;

        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty("votes", 105);
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty("created_at");
      });

      test("200: responds with the updated article object including correct keys and votes decremented properly", async () => {
        const decrementVotes = { inc_votes: -3 };

        const { body } = await request(app)
          .patch("/api/articles/1")
          .send(decrementVotes)
          .expect(200);

        const { article } = body;

        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty("votes", 97);
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty("created_at");
      });

      test("200: responds with the unchanged article when given an empty request body", async () => {
        const { body } = await request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200);
        const { article } = body;
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty("created_at");
      });

      test("400: responds with an error message when given an invalid article_id", async () => {
        const incrementVotes = { inc_votes: 5 };

        const { body } = await request(app)
          .patch("/api/articles/invalid-id")
          .send(incrementVotes)
          .expect(400);
        expect(body.msg).toBe("Bad request");
      });

      test("404: responds with an error message when given a valid but non-existent article_id", async () => {
        const incrementVotes = { inc_votes: 5 };

        const { body } = await request(app)
          .patch("/api/articles/9999")
          .send(incrementVotes)
          .expect(404);
        expect(body.msg).toBe("Article not found");
      });

      test("400: responds with an error message when given an invalid request body", async () => {
        const invalidBody = { inc_votes: "not-a-number" };

        const { body } = await request(app)
          .patch("/api/articles/1")
          .send(invalidBody)
          .expect(400);
        expect(body.msg).toBe("Bad request");
      });
    });
  });

  describe("GET - /api/articles?sort_by=column&order=asc|desc", () => {
    test("200: Responds with articles sorted by the created_at in descending order by default", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      const { articles } = body;

      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
    test("200: Responds with articles sorted by title column in ascending order)", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200);
      const { articles } = body;

      expect(articles).toBeSortedBy("title", { ascending: true });
    });

    test("200: Responds with articles sorted by votes in descending order", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=votes&order=desc")
        .expect(200);
      const { articles } = body;

      expect(articles).toBeSortedBy("votes", { descending: true });
    });

    test("200: Responds with articles sorted by comment_count in ascending order", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=comment_count&order=asc")
        .expect(200);
      const { articles } = body;

      expect(articles).toBeSortedBy("comment_count", { ascending: true });
    });

    test("400: Responds with an error message when given an invalid sort_by column", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=invalid_column")
        .expect(400);
      expect(body.msg).toBe("Bad request");
    });

    test("400: Responds with an error message when given an invalid order", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=title&order=invalid_order")
        .expect(400);
      expect(body.msg).toBe("Bad request");
    });
  });

  describe("GET - /api/articles?topic=slug", () => {
    test("200: Responds with articles filtered by the specified topic slug", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=mitch")
        .expect(200);
      const { articles } = body;

      expect(articles).toBeInstanceOf(Array);
      expect(articles.length).toBeGreaterThan(0);
      expect(articles[0]).toHaveProperty("topic", "mitch");
    });

    test("200: Responds with an empty array when there are no articles for the specified topic slug", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=paper")
        .expect(200);
      const { articles } = body;

      expect(articles).toBeInstanceOf(Array);
      expect(articles).toHaveLength(0);
    });

    test("404: Responds with an error message when given a non-existent topic slug", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=invalid_slug")
        .expect(404);
      expect(body.msg).toBe("Topic not found");
    });
  });
});

describe("Comments Endpoints", () => {
  describe("GET - /api/articles/:article_id/comments", () => {
    test("200: Responds with an array of comment objects for the specified article_id, each including the keys: comment_id, votes, created_at, author, body", async () => {
      const { body } = await request(app)
        .get("/api/articles/1/comments")
        .expect(200);
      const { comments } = body;

      expect(body).toHaveProperty("comments");
      expect(comments).toBeInstanceOf(Array);
      expect(comments).toHaveLength(11);
      expect(comments).toBeSortedBy("created_at", { descending: true });

      comments.forEach((comment) => {
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("body");
        expect(comment).toHaveProperty("article_id");
        expect(comment.article_id).toBe(1);
      });
    });

    test("200: Responds with an empty array when there are no comments for the specified article_id", async () => {
      const { body } = await request(app)
        .get("/api/articles/2/comments")
        .expect(200);
      const { comments } = body;
      expect(body).toHaveProperty("comments");
      expect(comments).toBeInstanceOf(Array);
      expect(comments).toHaveLength(0);
    });

    test("404: Responds with an error message when given a valid but non-existent article_id", async () => {
      const { body } = await request(app)
        .get("/api/articles/9999/comments")
        .expect(404);
      expect(body.msg).toBe("Article not found");
    });

    test("400: Responds with an error message when given an invalid article_id", async () => {
      const { body } = await request(app)
        .get("/api/articles/invalid-id/comments")
        .expect(400);
      expect(body.msg).toBe("Bad request");
    });
  });

  describe("POST - /api/articles/:article_id/comments", () => {
    test("201: Responds with the posted comment object including the keys: comment_id, author, article_id, votes, created_at, and body", async () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a new comment",
      };

      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201);
      const { comment } = body;

      expect(body).toHaveProperty("comment");
      expect(comment).toHaveProperty("comment_id");
      expect(comment).toHaveProperty("author", "butter_bridge");
      expect(comment).toHaveProperty("article_id", 1);
      expect(comment).toHaveProperty("votes", 0);
      expect(comment).toHaveProperty("created_at");
      expect(comment).toHaveProperty("body", "This is a new comment");
    });

    test("404: Responds with an error message when given a valid but non-existent article_id", async () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a new comment",
      };

      const { body } = await request(app)
        .post("/api/articles/9999/comments")
        .send(newComment)
        .expect(404);
      expect(body.msg).toBe("Article not found");
    });

    test("400: Responds with an error message when given an invalid article_id", async () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a new comment",
      };

      const { body } = await request(app)
        .post("/api/articles/invalid-id/comments")
        .send(newComment)
        .expect(400);
      expect(body.msg).toBe("Bad request");
    });

    test("400: Responds with an error message when required fields are missing in the request body", async () => {
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge" }) // Missing 'body'
        .expect(400);
      expect(body.msg).toMatch(/bad request/i);
    });

    test("404: Responds with an error message when given a valid but non-existent username", async () => {
      const newComment = {
        username: "non_existent_user",
        body: "This is a comment",
      };

      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404);

      expect(body.msg).toBe("User not found");
    });
  });

  describe("DELETE - /api/comments/:comment_id", () => {
    test("204: Responds with no content when a comment is successfully deleted", async () => {
      await request(app).delete("/api/comments/1").expect(204);
    });

    test("404: Responds with an error message when given a valid but non-existent comment_id", async () => {
      const { body } = await request(app)
        .delete("/api/comments/9999")
        .expect(404);
      expect(body.msg).toBe("Comment not found");
    });

    test("400: Responds with an error message when given an invalid comment_id", async () => {
      const { body } = await request(app)
        .delete("/api/comments/invalid-id")
        .expect(400);
      expect(body.msg).toBe("Bad request");
    });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an object with a key of users with a value of an array of user objects, each including the keys: username, avatar_url, and name", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    const { users } = body;

    expect(body).toHaveProperty("users");
    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(4);

    users.forEach((user) => {
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("avatar_url");
      expect(user).toHaveProperty("name");
    });
  });
});
