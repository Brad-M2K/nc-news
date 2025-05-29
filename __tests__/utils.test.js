const {
  convertTimestampToDate,
  getArticleIdByTitle,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("getArticleIdByTitle", () => {
  test("returns the correct article_id when given an article title", () => {
    const articles = [
      { article_id: 1, title: "Article One" },
      { article_id: 2, title: "Article Two" },
      { article_id: 3, title: "Article Three" },
    ];
    const result = getArticleIdByTitle("Article Two", articles);
    expect(result).toBe(2);
  });

  test("returns undefined when the title is not found", () => {
    const articles = [
      { article_id: 1, title: "Article One" },
      { article_id: 2, title: "Article Two" },
    ];
    const result = getArticleIdByTitle("Nonexistent Title", articles);
    expect(result).toBeUndefined();
  });

  test("is case-sensitive and returns undefined for mismatched case", () => {
    const articles = [
      { article_id: 1, title: "Case Sensitive" },
    ];
    const result = getArticleIdByTitle("case sensitive", articles);
    expect(result).toBeUndefined();
  });
});
