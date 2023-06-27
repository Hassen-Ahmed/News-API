const express = require("express");
const app = express();

const { getAllTopics } = require("./controllers/topics.controller");
const { getAllDescriptions } = require("./controllers/docs.controller");

app.get("/api", getAllDescriptions);

app.get("/api/topics", getAllTopics);

app.get("*", (req, res) => {
    res.status(404).send({ msg: "Not found!" });
});

module.exports = app;