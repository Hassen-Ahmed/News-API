const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { sqlErrorHandler, customErrorHandler, internalServerErrorHandler } = require("./errors");

const { getArticlesById, getAllArticles } = require("./controllers/articles.controller");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles);

app.use(sqlErrorHandler);
app.use(customErrorHandler);
app.use(internalServerErrorHandler);

module.exports = app;
