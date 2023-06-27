const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { sqlErrorHandler, customErrorHandler, internalServerErrorHandler } = require("./errors");

const { getArticlesById, getAllArticles } = require("./controllers/articles.controller");

const descriptionsData = require("./endpoints.json");

const app = express();

app.get("/api", (req, res) => {
    res.status(200).send(descriptionsData);
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found!" });
});

app.use(sqlErrorHandler);
app.use(customErrorHandler);
app.use(internalServerErrorHandler);

module.exports = app;
