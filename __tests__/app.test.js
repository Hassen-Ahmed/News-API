const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe("GET /api/topicss", () => {
    test("should return 200 and array of objects which they should have slug and description properties", () => {
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

    test("should return 404", () => {
        return request(app)
            .get("/api/wrongtopic")
            .expect(404)
            .then(({ body }) => {
                const topics = body;
                expect(topics.msg).toBe("Not found!");
            });
    });
});
