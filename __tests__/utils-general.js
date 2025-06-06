const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const {
  checkArticleExists,
  checkUserExists,
  ensurePresent,
} = require("../utils");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("checkArticleExists", () => {
  test("resolves if article exists", () => {
    return expect(checkArticleExists(1)).resolves.toBeUndefined();
  });

  test("rejects with 404 if article does not exist", () => {
    return expect(checkArticleExists(9999)).rejects.toEqual({
      status: 404,
      msg: "Article not found",
    });
  });
});

describe("checkUserExists", () => {
  test("resolves if user exists", () => {
    return expect(checkUserExists("butter_bridge")).resolves.toBeUndefined();
  });

  test("rejects with 404 if user does not exist", () => {
    return expect(checkUserExists("nonexistent_user")).rejects.toEqual({
      status: 404,
      msg: "User not found",
    });
  });
});

describe("ensurePresent", () => {
  test("does nothing if value is present", () => {
    expect(() => ensurePresent("something")).not.toThrow();
  });

  test("throws 400 with default msg if value is undefined", () => {
    try {
      ensurePresent(undefined);
    } catch (err) {
      expect(err).toEqual({ status: 400, msg: "Bad request" });
    }
  });

  test("throws 400 with custom msg if provided", () => {
    try {
      ensurePresent(undefined, "username is required");
    } catch (err) {
      expect(err).toEqual({ status: 400, msg: "username is required" });
    }
  });
});
