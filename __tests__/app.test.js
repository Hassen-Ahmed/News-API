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
    describe("GET /api/articles/:article_id/comments", () => {
        it("200: and with list of comment which they have article_id ", () => {
            return request(app)
                .get("/api/articles/9/comments")
                .expect(200)
                .then(({ body }) => {
                    const comments = body.comments;
                    expect(comments).toHaveLength(2);
                    expect(comments).toBeSortedBy("created_at", {
                        descending: false,
                    });
                    comments.forEach((comment) => {
                        expect(comment).toHaveProperty("comment_id", expect.any(Number));
                        expect(comment).toHaveProperty("votes", expect.any(Number));
                        expect(comment).toHaveProperty("created_at", expect.any(String));
                        expect(comment).toHaveProperty("author", expect.any(String));
                        expect(comment).toHaveProperty("body", expect.any(String));
                        expect(comment).toHaveProperty("article_id", expect.any(Number));
                    });
                });
        });
        it("200: if articles contain the id but not in hte comments", () => {
            return request(app)
                .get("/api/articles/2/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toEqual([]);
                });
        });
        test("404: respond with a msg of Not Found when the article id is valid but does not exist'", () => {
            return request(app)
                .get("/api/articles/mumboJumbo/comments")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request!");
                });
        });
        test("404:  and msg of Not found!", () => {
            return request(app)
                .get("/api/articles/9999/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Not found!");
                });
        });
    });
    describe("POST /api/articles/:article_id/comments", () => {
        test("200: should return 200 and insert/post to add new record to the comments table", () => {
            return request(app)
                .post("/api/articles/9/comments")
                .expect(200)
                .send({
                    user_name: "butter_bridge",
                    body: {
                        article_id: 9,
                        author: "butter_bridge",
                        votes: 20,
                        created_at: new Date(),
                        body: "post request will going to be ok",
                    },
                })
                .then(({ body }) => {
                    const { comments } = body;
                    expect(comments).toHaveProperty("comment_id", expect.any(Number));
                    expect(comments).toHaveProperty("body", expect.any(String));
                    expect(comments).toHaveProperty("article_id", expect.any(Number));
                    expect(comments).toHaveProperty("author", expect.any(String));
                    expect(comments).toHaveProperty("votes", expect.any(Number));
                    expect(comments).toHaveProperty("created_at", expect.any(String));
                });
        });
        test("404 should be returned when the article_id not exist in articles table but the body is ok", () => {
            return request(app)
                .post("/api/articles/9999/comments")
                .expect(404)
                .send({
                    user_name: "butter_bridge",
                    body: {
                        article_id: 9,
                        author: "butter_bridge",
                        votes: 20,
                        created_at: new Date(),
                        body: "post request will going to be ok",
                    },
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Not found!");
                });
        });
        test("404 should be returned when user_name from request body not exits in users table", () => {
            return request(app)
                .post("/api/articles/9/comments")
                .expect(404)
                .send({
                    user_name: "David",
                    body: {
                        article_id: 9,
                        author: "butter_bridge",
                        votes: 20,
                        created_at: new Date(),
                        body: "post request will going to be ok",
                    },
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Not found!");
                });
        });
        test("400 should be returned when the property article_id of the body cause foreign key relationship problem", () => {
            return request(app)
                .post("/api/articles/9/comments")
                .expect(400)
                .send({
                    user_name: "David",
                    body: {
                        article_id: 999,
                        author: "butter_bridge",
                        votes: 20,
                        created_at: new Date(),
                        body: "post request will going to be ok",
                    },
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be returned when the property author of the body cause foreign key relationship problem", () => {
            return request(app)
                .post("/api/articles/9/comments")
                .expect(400)
                .send({
                    user_name: "David",
                    body: {
                        article_id: 9,
                        author: "unKnown",
                        votes: 20,
                        created_at: new Date(),
                        body: "post request will going to be ok",
                    },
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
    });
});
