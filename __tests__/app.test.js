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

describe("All requests method and endpoints container", () => {
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
        it("200 should respond and article object with comment_count property.", () => {
            return request(app)
                .get("/api/articles/3")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;
                    expect(articles).toHaveProperty("comment_count", expect.any(String));
                });
        });
        test("400: should respond and msg of Invalid request when invalid article_id provided.", () => {
            return request(app)
                .get("/api/articles/mumboJumbo")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request!");
                });
        });
        test("404: should return and msg of Not found! when article_id is valid, but no resource found.", () => {
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
        test("201: should respond and update/post body comments table body column with article_id", () => {
            return request(app)
                .post("/api/articles/1/comments")
                .expect(201)
                .send({
                    username: "butter_bridge",
                    body: "post request will going to be ok",
                })
                .then(({ body }) => {
                    const { comments } = body;
                    expect(comments.article_id).toBe(1);
                    expect(comments).toHaveProperty("comment_id", expect.any(Number));
                    expect(comments).toHaveProperty("body", expect.any(String));
                    expect(comments).toHaveProperty("article_id", expect.any(Number));
                    expect(comments).toHaveProperty("author", expect.any(String));
                    expect(comments).toHaveProperty("votes", expect.any(Number));
                    expect(comments).toHaveProperty("created_at", expect.any(String));
                });
        });
        test("201: should respond and update/post body comments table body column with article_id and if the request body have others properties it will ignores them.", () => {
            return request(app)
                .post("/api/articles/1/comments")
                .expect(201)
                .send({
                    username: "butter_bridge",
                    body: "post request will going to be ok",
                    otherProp: 'I don"t no!',
                })
                .then(({ body }) => {
                    const { comments } = body;
                    expect(comments.article_id).toBe(1);
                    expect(comments).toHaveProperty("comment_id", expect.any(Number));
                    expect(comments).toHaveProperty("body", expect.any(String));
                    expect(comments).toHaveProperty("article_id", expect.any(Number));
                    expect(comments).toHaveProperty("author", expect.any(String));
                    expect(comments).toHaveProperty("votes", expect.any(Number));
                    expect(comments).toHaveProperty("created_at", expect.any(String));
                });
        });
        test("404 should be respond when the article_id not exist in articles table also in comments table.", () => {
            return request(app)
                .post("/api/articles/9999/comments")
                .expect(404)
                .send({
                    username: "butter_bridge",
                    body: "post request will going to be ok",
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Not found!");
                });
        });
        test("404 should be respond when username from request body not exits in users table", () => {
            return request(app)
                .post("/api/articles/9/comments")
                .expect(404)
                .send({
                    username: "David",
                    body: "post request will going to be ok",
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Not found!");
                });
        });

        test("400 should be respond when article_id is nonsense or invalid data type.", () => {
            return request(app)
                .post("/api/articles/nonsense/comments")
                .expect(400)
                .send({
                    username: "David",
                    body: "post request will going to be ok",
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when requested body is not include appropriate properties.", () => {
            return request(app)
                .post("/api/articles/9/comments")
                .expect(400)
                .send({
                    body: "post request will going to be ok",
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
    });
    describe("PATCH /api/articles/:article_id", () => {
        it("200 should be respond when article_id and body validation are valid", () => {
            return request(app)
                .patch("/api/articles/1")
                .expect(200)
                .send({ inc_votes: 2 })
                .then(({ body }) => {
                    const { article } = body;
                    expect(article["votes"]).toBe(102);

                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                });
        });

        test("400 should be respond when article_id isn't number type.", () => {
            return request(app)
                .patch("/api/articles/isNotANumber")
                .expect(400)
                .send({ inc_votes: 2 })
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when datatype of inc_votes is not a number.", () => {
            return request(app)
                .patch("/api/articles/9")
                .expect(400)
                .send({ inc_votes: "I am STRING!" })
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when the requested body is an empty object.", () => {
            return request(app)
                .patch("/api/articles/9")
                .expect(400)
                .send({})
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request!");
                });
        });

        test("404 should be respond when article_id is valid, but not found by resource.", () => {
            return request(app)
                .patch("/api/articles/999")
                .expect(404)
                .send({ inc_votes: 9 })
                .then(({ body }) => {
                    expect(body.msg).toBe("Not found!");
                });
        });
    });
    describe("DELETE /api/comments/9", () => {
        test("204 should be respond when the deletion is successful.", () => {
            return request(app).delete("/api/comments/9").expect(204);
        });

        test("400 should be respond when comment_id is NaN.", () => {
            return request(app)
                .delete("/api/comments/isNaN")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request!");
                });
        });

        test("404 should be respond when comment_id is valid, but not found by resource.", () => {
            return request(app)
                .delete("/api/comments/999")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Not found!");
                });
        });
    });
    describe("GET /api/users", () => {
        test("200 should be respond when successful fetched users data and respond.", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    const { users } = body;
                    expect(users).toHaveLength(4);
                    users.forEach((user) => {
                        expect(user).toHaveProperty("username", expect.any(String));
                        expect(user).toHaveProperty("name", expect.any(String));
                        expect(user).toHaveProperty("avatar_url", expect.any(String));
                    });
                });
        });
        test("404 should be respond when not user data is found", () => {
            return request(app)
                .get("/api/usersUnKnow")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Not found!");
                });
        });
    });
    describe("GET /api/articles (queries)", () => {
        test("200 will respond and list of articles when all queries are provided", () => {
            return request(app)
                .get("/api/articles?topic=mitch&sort_by=title&order=asc")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;
                    expect(articles).toBeSortedBy("title", {
                        descending: false,
                    });
                    expect(articles).toHaveLength(12);
                    expect(articles.body).toBeUndefined();

                    articles.forEach((article) => {
                        expect(article.topic).toBe("mitch");
                    });
                });
        });

        test("200 will respond and list of articles when all queries are provided except topic query", () => {
            return request(app)
                .get("/api/articles?sort_by=title&order=asc")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;
                    expect(articles).toBeSortedBy("title", {
                        descending: false,
                    });
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
        test("200 will respond and list of articles when all queries are NOT provided except sort_by query.", () => {
            return request(app)
                .get("/api/articles?sort_by=author")
                .expect(200)
                .then(({ body }) => {
                    const articles = body.articles;
                    expect(articles).toBeSortedBy("author", {
                        descending: true,
                    });
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
        test("404 will respond and when passed valid topic query, but no resource found", () => {
            return request(app)
                .get("/api/articles?topic=paper")
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Not found!");
                });
        });
        test("404 will respond and when sort_by by body which not be allowed", () => {
            return request(app)
                .get("/api/articles?sort_by=body")
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Not found!");
                });
        });
        test("404 will respond and when sort_by by body which not be allowed", () => {
            return request(app)
                .get("/api/articles?topic=999")
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Not found!");
                });
        });
        test("400 will respond and when sort_by query has invalid datatype", () => {
            return request(app)
                .get("/api/articles?sort_by=499")
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Bad request");
                });
        });

        test("400 will respond and when nonsense order query", () => {
            return request(app)
                .get("/api/articles?order=nonsense")
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Bad request");
                });
        });

        test("404 will respond and when passed valid sort_id query, but no resource found", () => {
            return request(app)
                .get("/api/articles?sort_by=body")
                .expect(404)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Not found!");
                });
        });
    });
    describe("GET /api/users/:username", () => {
        test("200 should respond and user object when username is the list of users", () => {
            return request(app)
                .get("/api/users/butter_bridge")
                .expect(200)
                .then(({ body }) => {
                    const { user } = body;
                    expect(user).toHaveProperty("username", expect.any(String));
                    expect(user).toHaveProperty("name", expect.any(String));
                    expect(user).toHaveProperty("avatar_url", expect.any(String));
                });
        });
        test("404 should respond when username isNot listed in users", () => {
            return request(app)
                .get("/api/users/somethingElse")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Not found!");
                });
        });
        test("400 should be respond when the datatype of username is other than string", () => {
            return request(app)
                .get("/api/users/555")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request!");
                });
        });
    });
    describe("PATCH /api/comments/:comment_id", () => {
        test("200 should be respond when passed valid comment_id and body", () => {
            return request(app)
                .patch("/api/comments/1")
                .expect(200)
                .send({ inc_votes: -1 })
                .then(({ body }) => {
                    const { comment } = body;
                    expect(comment["votes"]).toBe(15);
                    expect(comment).toHaveProperty("comment_id", expect.any(Number));
                    expect(comment).toHaveProperty("comment_id", expect.any(Number));
                    expect(comment).toHaveProperty("body", expect.any(String));
                    expect(comment).toHaveProperty("author", expect.any(String));
                    expect(comment).toHaveProperty("created_at", expect.any(String));
                });
        });
        test("200 should be respond and ignore other properties in the body except the inc_votes.", () => {
            return request(app)
                .patch("/api/comments/3")
                .expect(200)
                .send({ inc_votes: 20, i_am_hacker: "I am joking!" })
                .then(({ body }) => {
                    const { comment } = body;
                    expect(comment["votes"]).toBe(120);
                });
        });
        test("404 should be respond when passed valid comment_id, but no resource found.", () => {
            return request(app)
                .patch("/api/comments/98989")
                .expect(404)
                .send({ inc_votes: 20 })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Not found!");
                });
        });
        test("400 should be respond when passed invalid comment_id", () => {
            return request(app)
                .patch("/api/comments/otherThanNumber")
                .expect(400)
                .send({ inc_votes: 20 })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when passed wrong data type for inc_votes ", () => {
            return request(app)
                .patch("/api/comments/2")
                .expect(400)
                .send({ inc_votes: "increase" })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when passed empty request body", () => {
            return request(app)
                .patch("/api/comments/2")
                .expect(400)
                .send({})
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when passed other properties in request body except inc_votes", () => {
            return request(app)
                .patch("/api/comments/2")
                .expect(400)
                .send({ comment_id: 29, author: "butter_bridge" })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
    });
    describe("POST /api/articles", () => {
        test("201 should be respond when passed correct body.", () => {
            return request(app)
                .post("/api/articles")
                .expect(201)
                .send({
                    title: "Running a Node app",
                    topic: "paper",
                    author: "icellusedkars",
                    body: "bunch of body",
                })
                .then(({ body }) => {
                    const { article } = body;
                    expect(article).toHaveProperty("article_id", expect.any(Number));
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count", expect.any(String));
                });
        });
        test("400 should be respond when passed empty body object.", () => {
            return request(app)
                .post("/api/articles")
                .expect(400)
                .send({})
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when topic is not listed in topics table. ", () => {
            return request(app)
                .post("/api/articles")
                .expect(400)
                .send({
                    title: "Running a Node app",
                    topic: "somethingElse",
                    author: "butter_bridge",
                    body: "bunch of body",
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when author is not listed in users table.", () => {
            return request(app)
                .post("/api/articles")
                .expect(400)
                .send({
                    title: "Running a Node app",
                    topic: "mitch",
                    author: "anOtherAuthor",
                    body: "bunch of body",
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when passed incorrect data type for all body properties.", () => {
            return request(app)
                .post("/api/articles")
                .expect(400)
                .send({
                    title: "Running a Node app",
                    topic: 989898,
                    author: 99999898,
                    body: "bunch of body",
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when passed all correct body properties, but body property not included.", () => {
            return request(app)
                .post("/api/articles")
                .expect(400)
                .send({
                    title: "Running a Node app",
                    topic: "mitch",
                    author: "butter_bridge",
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
        test("400 should be respond when passed all correct body properties, but title property not included.", () => {
            return request(app)
                .post("/api/articles")
                .expect(400)
                .send({
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "why title is not here",
                })
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("Invalid request!");
                });
        });
    });
});
