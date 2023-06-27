const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { sqlErrorHandler, customErrorHandler, internalServerErrorHandler } = require("./errors");

const { getArticlesById } = require("./controllers/articles.controller");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.use(sqlErrorHandler);
app.use(customErrorHandler);
app.use(internalServerErrorHandler);

module.exports = app;
