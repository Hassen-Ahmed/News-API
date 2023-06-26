const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const descriptionTemplateData = require("../description-templet");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe("GET / POST / PUT / PATCH / DELETE ", () => {
    describe("GET", () => {
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
                .get("/api/wrongTopic")
                .expect(404)
                .then(({ body }) => {
                    const topics = body;
                    expect(topics.msg).toBe("Not found!");
                });
        });
        test("/api should return 200: and correct response json obj", () => {
            const listOfEndpoints = Object.keys(descriptionTemplateData);
            return request
                .agent(app)
                .get("/api")
                .expect(200)
                .then(({ body }) => {
                    const descriptions = body.descriptions;

                    listOfEndpoints.forEach((endpoint) => {
                        if (descriptions.hasOwnProperty(endpoint)) {
                            expect(descriptions[endpoint]).toHaveProperty(
                                "description",
                                expect.any(String)
                            );
                            expect(descriptions[endpoint]).toHaveProperty(
                                "queries",
                                expect.any(Array)
                            );
                            expect(descriptions[endpoint]).toHaveProperty(
                                "exampleResponse",
                                expect.any(Object)
                            );
                        }
                    });
                });
        });
    });
});
