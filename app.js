const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const app = express();

app.get("/api/topics", getAllTopics);

module.exports = app;
