const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const descriptionsData = require("../endpoints.json");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe("All requests", () => {
    describe("GET /api", () => {
        test("200: and return the contents of endpoint.json file", () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then(({ body }) => {
                    expect(body).toEqual(descriptionsData);
                });
        });
    });
    describe("GET /api/topics", () => {
        test("200: should return 200 and array of objects which they should have slug and description properties", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    const topics = body.topics;
                    expect(topics).toHaveLength(3);
                    topics.forEach((topic) => {
                        expect(topic).toHaveProperty("slug", expect.any(String));
                        expect(topic).toHaveProperty("description", expect.any(String));
                    });
                });
        });
    });
    describe("GET /api/articles/:article_id ", () => {
        it("200: /api/articles/:article_id :- should return :200 and array articles with that id", () => {
            return request(app)
                .get("/api/articles/3")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;

                    expect(articles).toHaveLength(1);
                    articles.forEach((articles) => {
                        expect(articles).toHaveProperty("article_id", expect.any(Number));
                        expect(articles).toHaveProperty("title", expect.any(String));
                        expect(articles).toHaveProperty("topic", expect.any(String));
                        expect(articles).toHaveProperty("author", expect.any(String));
                        expect(articles).toHaveProperty("body", expect.any(String));
                        expect(articles).toHaveProperty("created_at", expect.any(String));
                        expect(articles).toHaveProperty("votes", expect.any(Number));
                        expect(articles).toHaveProperty("article_img_url", expect.any(String));
                    });
                });
        });
        test("400: /api/articles/:article_id :- should return :400 and msg of Invalid request!", () => {
            return request(app)
                .get("/api/articles/mumboJumbo")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request!");
                });
        });
        test("404: /api/articles/:article_id :- should return :404 and msg of Not found!", () => {
            return request(app)
                .get("/api/articles/999")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Not found!");
                });
        });
    });
    describe("GET /api/articles", () => {
        test("200: /api/articles :- should return :200 and list of articles with comment_count", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;

                    expect(articles).toHaveLength(13);
                    expect(articles.body).toBeUndefined();

                    articles.forEach((article) => {
                        expect(article).toHaveProperty("author", expect.any(String));
                        expect(article).toHaveProperty("title", expect.any(String));
                        expect(article).toHaveProperty("article_id", expect.any(Number));
                        expect(article).toHaveProperty("topic", expect.any(String));
                        expect(article).toHaveProperty("created_at", expect.any(String));
                        expect(article).toHaveProperty("votes", expect.any(Number));
                        expect(article).toHaveProperty("article_img_url", expect.any(String));
                        expect(article).toHaveProperty("comments_count", expect.any(String));
                    });
                });
        });
        test("404: /api/articles :- should return :404 and msg of Not found!", () => {
            return request(app)
                .get("/api/wrong")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Not found!");
                });
        });
    });
});
