const express = require("express");
const app = express();
const descriptions = require("./endpoints.json");

const { getAllTopics } = require("./controllers/topics.controller");

app.get("/api", (req, res) => {
    res.status(200).send({ descriptions });
});

app.get("/api/topics", getAllTopics);

app.all("*", (req, res) => {
    res.status(404).send({ status: 400, msg: "Not found!" });
});

module.exports = app;
